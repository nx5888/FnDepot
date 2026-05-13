"""Deploy rebuilt fpk to NAS shared folder and app center"""
import paramiko, time, os

HOST = '10.0.0.159'
ADMIN_PWD = 'ruan780429'
ROOT_PWD = 'Aa147258'

local_fpk = r'D:\workspace\RTS-reference\chat2api-fpk-build\chat2api.fpk'
local_tgz = r'D:\workspace\RTS-reference\chat2api-fpk-build\app.tgz'

print(f'FPK: {local_fpk} ({os.path.getsize(local_fpk)} bytes)')
print(f'TGZ: {local_tgz} ({os.path.getsize(local_tgz)} bytes)')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname=HOST, port=22, username='admin', password=ADMIN_PWD,
               allow_agent=False, look_for_keys=False, timeout=10)

# SFTP upload
sftp = client.open_sftp()
sftp.put(local_fpk, '/tmp/chat2api.fpk')
sftp.put(local_tgz, '/tmp/app.tgz')
sftp.close()
print('SFTP upload OK')

# Copy via su
shell = client.invoke_shell()
time.sleep(1)
shell.send('su -\n')
time.sleep(0.5)
shell.send(ROOT_PWD + '\n')
time.sleep(1)

cmd = (
    'cp /tmp/chat2api.fpk "/vol1/1000/Admin file/软件工具/NAS/" && '
    'cp /tmp/app.tgz "/vol1/1000/Admin file/软件工具/NAS/" && '
    'cp /tmp/chat2api.fpk /vol2/@appcenter/chat2api/ && '
    'cp /tmp/chat2api.fpk /usr/local/apps/@appcenter/chat2api/ && '
    'echo FPK_DONE'
)
shell.send(cmd + '\n')
time.sleep(6)
out = b''
while shell.recv_ready():
    out += shell.recv(65535)
    time.sleep(0.3)
print('COPY:', out.decode('utf-8', errors='replace'))

# Restart services
shell.send('systemctl restart chat2api chat2api-mgmt && echo RESTART_OK\n')
time.sleep(4)
out2 = b''
while shell.recv_ready():
    out2 += shell.recv(65535)
    time.sleep(0.3)
print('RESTART:', out2.decode('utf-8', errors='replace'))

shell.close()
client.close()
print('NAS DEPLOY COMPLETE')
