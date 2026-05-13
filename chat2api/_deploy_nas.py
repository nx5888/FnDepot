#!/usr/bin/env python3
"""Deploy fpk and app.tgz to correct NAS paths"""
import paramiko, time, os

HOST = '10.0.0.159'
ADMIN_PWD = 'ruan780429'
ROOT_PWD = 'Aa147258'

LOCAL = r'D:\workspace\RTS-reference\chat2api-fpk-build'
FILES = [
    ('chat2api.fpk', os.path.join(LOCAL, 'chat2api.fpk')),
    ('app.tgz', os.path.join(LOCAL, 'app.tgz')),
]

for name, path in FILES:
    print(f'{name}: {os.path.getsize(path)} bytes')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, 22, 'admin', ADMIN_PWD, allow_agent=False, look_for_keys=False, timeout=10)

# SFTP upload all files
sftp = client.open_sftp()
for name, path in FILES:
    sftp.put(path, f'/tmp/{name}')
    print(f'Uploaded {name}')
sftp.close()

# su-based copy
shell = client.invoke_shell()
time.sleep(1)
shell.recv(65535)  # flush
shell.send('su -\n')
time.sleep(0.5)
shell.recv(65535)  # flush password prompt
shell.send(ROOT_PWD + '\n')
time.sleep(1.5)
shell.recv(65535)  # flush su output

# Copy to NAS shared
cmds = [
    'cp /tmp/chat2api.fpk "/vol1/1000/Admin file/软件工具/NAS/"',
    'cp /tmp/app.tgz "/vol1/1000/Admin file/软件工具/NAS/"',
    # Copy fpk to app dir for upgrade
    'cp /tmp/chat2api.fpk /usr/local/apps/@appcenter/chat2api/',
    'echo DONE',
]
shell.send(' && '.join(cmds) + '\n')
time.sleep(4)
out = b''
while shell.recv_ready():
    out += shell.recv(65535)
    time.sleep(0.3)
print('COPY:', out.decode('utf-8', errors='replace'))

# Verify files exist
shell.send('ls -la "/vol1/1000/Admin file/软件工具/NAS/chat2api.fpk" && echo VERIFIED\n')
time.sleep(2)
out2 = b''
while shell.recv_ready():
    out2 += shell.recv(65535)
    time.sleep(0.3)
print('VERIFY:', out2.decode('utf-8', errors='replace'))

shell.close()
client.close()
print('DEPLOY COMPLETE')
