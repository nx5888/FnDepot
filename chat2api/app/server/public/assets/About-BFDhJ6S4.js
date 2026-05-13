import { c as createLucideIcon, u as useTranslation, r as reactExports, F as FileText, j as jsxRuntimeExports, af as logoIcon, Z as Zap } from "./index-D95seZVG.js";
import { G as Globe } from "./globe-DpH37jXF.js";
import { L as LoaderCircle } from "./loader-circle-Bqbxj1cN.js";
import { C as CircleCheck } from "./circle-check-DZpCy2Zv.js";
import { R as RefreshCw } from "./refresh-cw-CMnjVBJ7.js";
import { C as CircleAlert } from "./circle-alert-By9jTxHc.js";
import { D as Download } from "./download-2R0c7AaF.js";
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bug = createLucideIcon("Bug", [
  ["path", { d: "m8 2 1.88 1.88", key: "fmnt4t" }],
  ["path", { d: "M14.12 3.88 16 2", key: "qol33r" }],
  ["path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1", key: "d7y7pr" }],
  [
    "path",
    {
      d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",
      key: "xs1cw7"
    }
  ],
  ["path", { d: "M12 20v-9", key: "1qisl0" }],
  ["path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5", key: "32zzws" }],
  ["path", { d: "M6 13H2", key: "82j7cp" }],
  ["path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4", key: "4p0ekp" }],
  ["path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4", key: "18gb23" }],
  ["path", { d: "M22 13h-4", key: "1jl80f" }],
  ["path", { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4", key: "k3fwyw" }]
]);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Github = createLucideIcon("Github", [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "tonef"
    }
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }]
]);
function About() {
  const { t } = useTranslation();
  const [appVersion, setAppVersion] = reactExports.useState("1.3.0");
  reactExports.useEffect(() => {
    if (window.electronAPI?.app?.getVersion) {
      window.electronAPI.app.getVersion().then((v) => {
        if (v) setAppVersion(v);
      });
    }
  }, []);
  const [appUpdateStatus, setAppUpdateStatus] = reactExports.useState({ checking: false });
  const [downloadProgress, setDownloadProgress] = reactExports.useState(null);
  const [isDownloading, setIsDownloading] = reactExports.useState(false);
  const [isDownloaded, setIsDownloaded] = reactExports.useState(false);
  const [downloadError, setDownloadError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!window.electronAPI?.app) return;
    const unsubscribeProgress = window.electronAPI.app.onUpdateProgress((progress) => {
      setDownloadProgress(progress);
      setIsDownloading(true);
      setDownloadError(null);
    });
    const unsubscribeDownloaded = window.electronAPI.app.onUpdateDownloaded(() => {
      setIsDownloading(false);
      setIsDownloaded(true);
      setDownloadProgress(null);
      setDownloadError(null);
    });
    const unsubscribeError = window.electronAPI.app.onUpdateError((error) => {
      setIsDownloading(false);
      setDownloadProgress(null);
      setDownloadError(error?.message || "Download failed");
    });
    return () => {
      unsubscribeProgress();
      unsubscribeDownloaded();
      unsubscribeError();
    };
  }, []);
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
  const formatSpeed = (bytesPerSecond) => {
    return `${formatBytes(bytesPerSecond)}/s`;
  };
  const handleCheckAppUpdate = async () => {
    setAppUpdateStatus({ checking: true });
    setDownloadError(null);
    setIsDownloaded(false);
    try {
      const result = await window.electronAPI.app.checkUpdate();
      setAppUpdateStatus({
        checking: false,
        result
      });
    } catch (error) {
      setAppUpdateStatus({
        checking: false,
        result: {
          hasUpdate: false,
          currentVersion: appVersion,
          latestVersion: appVersion,
          error: String(error)
        }
      });
    }
  };
  const handleDownloadUpdate = async () => {
    try {
      setIsDownloading(true);
      setDownloadError(null);
      await window.electronAPI.app.downloadUpdate();
    } catch (error) {
      setIsDownloading(false);
      setDownloadError(error instanceof Error ? error.message : "Download failed");
    }
  };
  const handleInstallUpdate = async () => {
    try {
      await window.electronAPI.app.installUpdate();
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "Install failed");
    }
  };
  const handleOpenExternal = (url) => {
    if (window.electronAPI?.app?.openExternal) {
      window.electronAPI.app.openExternal(url);
    } else {
      window.open(url, "_blank");
    }
  };
  const links = [
    {
      label: t("about.github"),
      icon: Github,
      url: "https://github.com/xiaoY233/Chat2API"
    },
    {
      label: t("about.documentation"),
      icon: FileText,
      url: "https://chat2api-doc.vercel.app/"
    },
    {
      label: t("about.reportIssue"),
      icon: Bug,
      url: "https://github.com/xiaoY233/Chat2API/issues"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6 pb-12 px-4 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-10 text-center relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--accent-primary)]/10 blur-[80px] rounded-full pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mb-6 animate-scale-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-24 h-24 rounded-[2rem] glass-card p-4 shadow-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: logoIcon,
          alt: "Chat2API Logo",
          className: "w-full h-full object-contain drop-shadow-md"
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold tracking-tight text-[var(--text-primary)]", children: t("settings.appName") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[var(--text-muted)] font-medium max-w-sm mx-auto", children: t("about.tagline") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 mt-3 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-[var(--text-muted)]", children: [
            "v",
            appVersion
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3.5 h-3.5" }),
        t("about.links")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => handleOpenExternal(link.url),
          className: "w-full flex items-center justify-between p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg-hover)] hover:border-[var(--glass-border-hover)] transition-all group cursor-pointer text-left",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-lg bg-[var(--bg-tertiary)]/50 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(link.icon, { className: "w-3.5 h-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors font-medium", children: link.label })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 flex items-center justify-center rounded-full bg-[var(--bg-tertiary)]/30 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[var(--text-primary)]", children: "↗" }) })
          ]
        },
        link.label
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-6 relative overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-[var(--text-primary)] flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-[var(--accent-primary)]" }),
            t("about.appUpdates")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[var(--text-muted)]", children: [
            t("settings.currentVersion"),
            ":",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-primary)] font-mono ml-1", children: appUpdateStatus.result?.currentVersion || appVersion })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: appUpdateStatus.checking ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-muted)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: t("settings.checking") })
        ] }) : isDownloading && downloadProgress ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 min-w-[200px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-[var(--text-muted)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("settings.downloadingUpdate") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
              downloadProgress.percent.toFixed(1),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-[var(--accent-primary)] transition-all duration-300",
              style: { width: `${downloadProgress.percent}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-[var(--text-dim)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatSpeed(downloadProgress.bytesPerSecond) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              formatBytes(downloadProgress.transferred),
              " / ",
              formatBytes(downloadProgress.total)
            ] })
          ] })
        ] }) : isDownloaded ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--success)]/10 shadow-[0_0_8px_var(--success)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 text-[var(--success)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-[var(--success)]", children: t("settings.updateDownloaded") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleInstallUpdate,
              className: "px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white text-sm font-medium rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-[var(--accent-primary)]/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
                t("settings.restartAndInstall")
              ]
            }
          )
        ] }) : downloadError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-error)]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 text-[var(--accent-error)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-[var(--accent-error)]", children: t("settings.updateCheckFailed") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleCheckAppUpdate,
              className: "px-4 py-2 bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-hover)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] rounded-full text-sm text-[var(--text-primary)] font-medium transition-all duration-200 flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 text-[var(--text-muted)]" }),
                t("settings.retry")
              ]
            }
          )
        ] }) : appUpdateStatus.result && !appUpdateStatus.result.error && appUpdateStatus.result.hasUpdate ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--success)]/10 shadow-[0_0_8px_var(--success)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-[var(--success)]", children: [
              t("settings.updateAvailable"),
              " v",
              appUpdateStatus.result.latestVersion
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleDownloadUpdate,
              className: "px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white text-sm font-medium rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-[var(--accent-primary)]/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
                t("settings.downloadUpdate")
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleCheckAppUpdate,
            className: "px-4 py-2 bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-hover)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] rounded-full text-sm text-[var(--text-primary)] font-medium transition-all duration-200 flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-[var(--text-muted)]" }),
              t("settings.checkUpdates")
            ]
          }
        ) })
      ] }),
      appUpdateStatus.result && !appUpdateStatus.checking && !isDownloading && !isDownloaded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-[var(--glass-border)]", children: appUpdateStatus.result.error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[var(--accent-error)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: t("settings.updateCheckFailed") })
      ] }) : !appUpdateStatus.result.hasUpdate ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[var(--accent-success)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: t("settings.upToDate") })
      ] }) : null })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3 pt-8 pb-4 border-t border-[var(--glass-border)] opacity-60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold tracking-[0.2em] text-[var(--text-dim)] uppercase", children: t("about.credits") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed", children: t("about.builtWith") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-[var(--text-dim)] font-mono", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " ",
        t("settings.appName"),
        " • GPL-3.0 License"
      ] })
    ] })
  ] }) });
}
export {
  About
};
