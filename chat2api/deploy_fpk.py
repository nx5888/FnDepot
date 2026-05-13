import paramiko, time, sys, os

host = '10.0.0.159'
port = 22
username = 'admin'
admin_pwd = 'ruan780429'
root_pwd = 'Aa147258'

# Local updated file
local_file = r'D:\workspace\RTS-reference\chat2api-fpk-build\app\server\public\assets\index-D95seZVG.js'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    client.connect(hostname=host, port=port, username=username, password=admin_pwd,
                  allow_agent=False, look_for_keys=False, timeout=10)
    transport = client.get_transport()

    # Upload file to /tmp/ via SFTP
    sftp = client.open_sftp()
    remote_tmp = '/tmp/index-D95seZVG.js'
    sftp.put(local_file, remote_tmp)
    sftp.close()
    print('SFTP upload OK')

    # Copy to both locations with su
    shell = client.invoke_shell()
    time.sleep(1)
    shell.send('su -\n')
    time.sleep(0.5)
    shell.send(root_pwd + '\n')
    time.sleep(0.5)

    # Copy to both @appcenter locations
    cmd = 'cp /tmp/index-D95seZVG.js /vol2/@appcenter/chat2api/server/public/assets/index-D95seZVG.js && cp /tmp/index-D95seZVG.js /usr/local/apps/@appcenter/chat2api/server/public/assets/index-D95seZVG.js && echo "OK"\n'
    shell.send(cmd)
    time.sleep(2)
    out = shell.recv(65535).decode('utf-8', errors='replace')
    print('COPY:', out)

    # Restart services
    cmd2 = 'systemctl restart chat2api chat2api-mgmt && sleep 2 && systemctl is-active chat2api chat2api-mgmt\n'
    shell.send(cmd2)
    time.sleep(3)
    out2 = shell.recv(65535).decode('utf-8', errors='replace')
    print('RESTART:', out2)

    shell.close()
    client.close()
except Exception as e:
    print(f'ERROR: {e}')
    import traceback
    traceback.print_exc()
    sys.exit(1)
