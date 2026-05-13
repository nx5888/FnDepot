/**
 * Chat2API Web Bridge
 * Replaces Electron IPC (contextBridge/ipcRenderer) with HTTP REST API calls.
 * Loaded BEFORE the React bundle, sets up window.electronAPI.
 * 
 * REST API paths align with src/main/proxy/routes/management/*.ts
 */

(function() {
  'use strict';

  const MGMT_SECRET = 'chat2api-fpk-secret-2026';

  const BASE = '';
  const REST = (path, options) =>
    fetch(BASE + path, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + MGMT_SECRET,
        ...options?.headers,
      },
      ...options,
    }).then(r => {
      if (r.status === 204) return {};
      return r.json();
    }).then(resp => {
      if (resp && resp.success !== undefined && !resp.success) {
        return Promise.reject(resp.error || { message: 'API error: ' + path });
      }
      return resp && resp.data !== undefined ? resp.data : resp;
    })
    .catch(err => {
      console.warn('[Bridge] API error ' + path + ':', err?.message || err);
      throw err;
    });

  // Helper: no-op event listener cleanup
  const listen = () => () => {};

  window.electronAPI = {
    // === Proxy API ===
    proxy: {
      start: (port) => REST('/v0/management/proxy/start', { method: 'POST', body: JSON.stringify({ port }) }).then(() => true),
      stop: () => REST('/v0/management/proxy/stop', { method: 'POST' }).then(() => true),
      restart: () => REST('/v0/management/proxy/restart', { method: 'POST' }).then(() => true),
      getStatus: () => REST('/v0/management/proxy/status').then(data => ({
        isRunning: data.isRunning || false,
        port: data.port || 8080,
        host: data.host || '0.0.0.0',
        uptime: data.uptime || 0,
        startTime: data.startTime,
        statistics: data.statistics || {
          totalRequests: 0, successRequests: 0, failedRequests: 0, activeConnections: 0,
        },
      })),
      onStatusChanged: (cb) => listen('proxy:statusChanged', cb),
    },

    // === Config API ===
    config: {
      get: () => REST('/v0/management/config'),
      update: (updates) => REST('/v0/management/config', { method: 'PUT', body: JSON.stringify(updates) }),
      getKey: (key) => REST('/v0/management/config/' + key),
      updateKey: (key, value) => REST('/v0/management/config/' + key, { method: 'PUT', body: JSON.stringify({ value }) }),
      reset: () => REST('/v0/management/config', { method: 'PUT', body: JSON.stringify({}) }),
    },

    // === Store API (fallback to config) ===
    store: {
      get: (key) => {
        if (key === 'config' || key.startsWith('config.')) return REST('/v0/management/config');
        return Promise.resolve(undefined);
      },
      set: () => Promise.resolve(),
      delete: () => Promise.resolve(),
      clearAll: () => Promise.resolve(),
      onInitError: (cb) => listen('store:initError', cb),
      retryInit: () => Promise.resolve({ success: true }),
    },

    // === Providers API ===
    providers: {
      getAll: () => REST('/v0/management/providers'),
      getBuiltin: () => REST('/v0/management/providers/builtin'),
      add: (data) => REST('/v0/management/providers', { method: 'POST', body: JSON.stringify(data) }),
      update: (id, updates) => REST('/v0/management/providers/' + id, { method: 'PUT', body: JSON.stringify(updates) }),
      delete: (id) => REST('/v0/management/providers/' + id, { method: 'DELETE' }).then(() => true),
      checkStatus: (providerId) => REST('/v0/management/providers/' + providerId + '/check'),
      checkAllStatus: () => REST('/v0/management/providers/check-all').catch(() => ({})),
      duplicate: (id) => REST('/v0/management/providers/' + id + '/duplicate', { method: 'POST' }),
      export: (id) => REST('/v0/management/providers/' + id + '/export').then(r => JSON.stringify(r)),
      import: (jsonData) => REST('/v0/management/providers/import', { method: 'POST', body: typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData) }),
      updateModels: (providerId) => REST('/v0/management/providers/' + providerId + '/models', { method: 'PUT' }),
      getEffectiveModels: (providerId) => REST('/v0/management/providers/' + providerId + '/effective-models'),
      addCustomModel: (providerId, model) => REST('/v0/management/providers/' + providerId + '/custom-models', { method: 'POST', body: JSON.stringify(model) }),
      removeModel: (providerId, modelName) => REST('/v0/management/providers/' + providerId + '/custom-models/' + encodeURIComponent(modelName), { method: 'DELETE' }),
      resetModels: (providerId) => REST('/v0/management/providers/' + providerId + '/models/reset', { method: 'POST' }),
    },

    // === Accounts API ===
    accounts: {
      getAll: (includeCredentials) => REST('/v0/management/accounts' + (includeCredentials ? '?includeCredentials=true' : '')),
      getById: (id, includeCredentials) => REST('/v0/management/accounts/' + id + (includeCredentials ? '?includeCredentials=true' : '')),
      getByProvider: (providerId) => REST('/v0/management/accounts?providerId=' + encodeURIComponent(providerId)),
      add: (data) => REST('/v0/management/accounts', { method: 'POST', body: JSON.stringify(data) }),
      update: (id, updates) => REST('/v0/management/accounts/' + id, { method: 'PUT', body: JSON.stringify(updates) }),
      delete: (id) => REST('/v0/management/accounts/' + id, { method: 'DELETE' }).then(() => true),
      validate: (accountId) => REST('/v0/management/accounts/' + accountId + '/validate', { method: 'POST' }),
      validateToken: (providerId, credentials) => REST('/v0/management/accounts/validate-token', { method: 'POST', body: JSON.stringify({ providerId, credentials }) }),
      getCredits: (accountId) => REST('/v0/management/accounts/' + accountId + '/credits'),
      clearChats: (accountId) => REST('/v0/management/accounts/' + accountId + '/chats', { method: 'DELETE' }),
    },

    // === Statistics API ===
    statistics: {
      get: () => REST('/v0/management/statistics'),
      getDaily: (days) => REST('/v0/management/statistics/daily' + (days ? '?days=' + days : '')),
      reset: () => REST('/v0/management/statistics/reset', { method: 'POST' }),
    },

    // === Sessions API ===
    sessions: {
      getAll: (filters) => {
        var params = new URLSearchParams();
        if (filters) Object.entries(filters).forEach(function(kv) { var k=kv[0],v=kv[1]; if (v !== undefined) params.set(k, v); });
        return REST('/v0/management/sessions?' + params.toString());
      },
      getById: (id) => REST('/v0/management/sessions/' + id),
      create: (data) => REST('/v0/management/sessions', { method: 'POST', body: JSON.stringify(data) }),
      update: (id, updates) => REST('/v0/management/sessions/' + id, { method: 'PUT', body: JSON.stringify(updates) }),
      delete: (id) => REST('/v0/management/sessions/' + id, { method: 'DELETE' }).then(function() { return true; }),
      deleteMessages: (sessionId, messageIds) => REST('/v0/management/sessions/' + sessionId + '/messages', { method: 'DELETE', body: JSON.stringify({ messageIds: messageIds }) }),
    },

    // === Model Mappings API ===
    modelMappings: {
      get: () => REST('/v0/management/modelMappings'),
      update: (mappings) => REST('/v0/management/modelMappings', { method: 'PUT', body: JSON.stringify(mappings) }),
    },

    // === API Keys API ===
    apiKeys: {
      getAll: () => REST('/v0/management/apiKeys'),
      add: (data) => REST('/v0/management/apiKeys', { method: 'POST', body: JSON.stringify(data) }),
      delete: (id) => REST('/v0/management/apiKeys/' + id, { method: 'DELETE' }).then(function() { return true; }),
    },

    // === Tool Calling API ===
    toolCalling: {
      get: () => REST('/v0/management/toolCalling'),
      update: (config) => REST('/v0/management/toolCalling', { method: 'PUT', body: JSON.stringify(config) }),
    },

    // === Management API Settings ===
    managementApi: {
      getSettings: () => REST('/v0/management/config').then(function(cfg) { return {
        enableManagementApi: (cfg.managementApi && cfg.managementApi.enableManagementApi) || false,
        managementApiSecret: (cfg.managementApi && cfg.managementApi.managementApiSecret) || '',
        allowedIps: (cfg.managementApi && cfg.managementApi.allowedIps) || [],
      }; }),
      updateSettings: function(settings) { return REST('/v0/management/config', {
        method: 'PUT',
        body: JSON.stringify({ managementApi: settings }),
      }); },
      testConnection: () => REST('/v0/management/proxy/status').then(function() { return true; }).catch(function() { return false; }),
    },

    // === Logs (no REST endpoint) ===
    logs: {
      getLogs: () => Promise.resolve([]),
      getLog: () => Promise.resolve(null),
      getLogCount: () => Promise.resolve(0),
      getRecentErrors: () => Promise.resolve([]),
      deleteLog: () => Promise.resolve(),
      clearAll: () => Promise.resolve(),
    },

    // === Request Logs (no REST endpoint) ===
    requestLogs: {
      getLogs: () => Promise.resolve([]),
      getLog: () => Promise.resolve(null),
      getStats: () => Promise.resolve({ total: 0, success: 0, failed: 0, avgLatency: 0 }),
      clearLogs: () => Promise.resolve(),
      deleteLog: () => Promise.resolve(),
      getExport: () => Promise.resolve('[]'),
      getLogCount: () => Promise.resolve(0),
      getStreamLogs: () => Promise.resolve([]),
    },

    // === Prompts (no REST endpoint) ===
    prompts: {
      getAll: () => Promise.resolve([]),
      getByType: () => Promise.resolve([]),
      get: function(id) { return Promise.resolve(null); },
      create: function(data) { return Promise.resolve({ id: Date.now().toString(), createdAt: Date.now(), updatedAt: Date.now(), ...data }); },
      update: function(id, updates) { return Promise.resolve({ id: id, ...updates }); },
      delete: function(id) { return Promise.resolve(); },
    },

    // === OAuth (not available) ===
    oauth: {
      startOAuthFlow: function() { return Promise.reject(new Error('OAuth not available in web mode')); },
      cancelOAuthFlow: function() {},
      onOAuthResult: function(cb) { return listen('oauth:result', cb); },
    },

    // === Context Management ===
    contextManagement: {
      getContext: function(sessionId) { return Promise.resolve(null); },
      updateContext: function(sessionId, context) { return Promise.resolve(); },
      clearContext: function(sessionId) { return Promise.resolve(); },
      getSettings: function() { return Promise.resolve({}); },
      updateSettings: function(settings) { return Promise.resolve(); },
    },

    // === App API ===
    app: {
      getVersion: () => Promise.resolve('1.3.0 (fpk)'),
      minimize: function() {},
      maximize: function() {},
      close: function() {},
      isMaximized: function() { return false; },
      onMaximize: function(cb) { return listen('app:maximize', cb); },
      onUnmaximize: function(cb) { return listen('app:unmaximize', cb); },
      checkForUpdates: function() { return Promise.resolve({ updateAvailable: false, version: '' }); },
      downloadUpdate: function() { return Promise.resolve(); },
      onUpdateProgress: function(cb) { return listen('update:progress', cb); },
      onUpdateDownloaded: function(cb) { return listen('update:downloaded', cb); },
      onUpdateError: function(cb) { return listen('update:error', cb); },
      installUpdate: function() { return Promise.resolve(); },
      openExternal: function(url) { window.open(url, '_blank'); },
      setTitle: function(title) { document.title = title; },
      platform: 'web',
      isAdmin: true,
    },

    // === Tray (not applicable) ===
    tray: {
      updateProviderStatus: function() {},
      updateProxyStatus: function() {},
      toggleWindowVisibility: function() {},
    },
  };

  console.log('[Bridge] electronAPI initialized (fpk web mode)');
})();
