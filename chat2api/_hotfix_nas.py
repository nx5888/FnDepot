"""Hotfix: Deploy modified JS files directly to running NAS instance"""
import paramiko, time, os

HOST = '10.0.0.159'
ADMIN_PWD = 'ruan780429'
ROOT_PWD = 'Aa147258'

# Local source files  
BASE = r'D:\workspace\RTS-reference\chat2api-fpk-build\app\server\public'
ASSETS = os.path.join(BASE, 'assets')

FILES = [
    ('index-D95seZVG.js', os.path.join(ASSETS, 'index-D95seZVG.js'), 'assets/index-D95seZVG.js'),
    ('Dashboard-BVDXeLnV.js', os.path.join(ASSETS, 'Dashboard-BVDXeLnV.js'), 'assets/Dashboard-BVDXeLnV.js'),
    ('index.html', os.path.join(BASE, 'index.html'), 'index.html'),
]

# Verify local files exist
for name, local_path, _ in FILES:
    if not os.path.exists(local_path):
        print(f'ERROR: {name} not found at {local_path}')
        exit(1)
    print(f'{name}: {os.path.getsize(local_path)} bytes')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname=HOST, port=22, username='admin', password=ADMIN_PWD,
               allow_agent=False, look_for_keys=False, timeout=10)
print('SSH OK')

# SFTP upload
sftp = client.open_sftp()
for name, local_path, _ in FILES:
    remote_tmp = f'/tmp/{name}'
    sftp.put(local_path, remote_tmp)
    print(f'Uploaded {name}')
sftp.close()

# Copy via su
shell = client.invoke_shell()
time.sleep(1)
if shell.recv_ready():
    shell.recv(65535)
shell.send('su -\n')
time.sleep(0.5)
shell.recv(65535)
shell.send(ROOT_PWD + '\n')
time.sleep(1.5)
if shell.recv_ready():
    shell.recv(65535)

DST1 = '/vol2/@appcenter/chat2api/server/public'
DST2 = '/usr/local/apps/@appcenter/chat2api/server/public'

cmds = []
for name, _, subpath in FILES:
    cmds.append(f'cp /tmp/{name} {DST1}/{subpath}')
    cmds.append(f'cp /tmp/{name} {DST2}/{subpath}')
cmds.append('echo COPY_DONE')

shell.send(' && '.join(cmds) + '\n')
time.sleep(4)

out = b''
while shell.recv_ready():
    out += shell.recv(65535)
    time.sleep(0.3)
print('COPY:', out.decode('utf-8', errors='replace'))

# Restart only mgmt (serves the UI)
shell.send('systemctl restart chat2api-mgmt && echo MGMT_OK\n')
time.sleep(3)

out2 = b''
while shell.recv_ready():
    out2 += shell.recv(65535)
    time.sleep(0.3)
print('RESTART:', out2.decode('utf-8', errors='replace'))

shell.close()
client.close()
print('HOTFIX COMPLETE')
