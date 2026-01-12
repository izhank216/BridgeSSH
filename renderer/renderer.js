import { Terminal } from '@xterm/xterm'
import '@xterm/css/xterm.css'

const term = new Terminal({
  fontFamily: "'Ubuntu Mono', monospace",
  fontSize: 14,
  theme: { background: '#1e1e1e', foreground: '#00ff00' }
})
term.open(document.getElementById('terminal'))
term.focus()

$('#sshForm').validator().on('submit', async function(e){
  if (!e.isDefaultPrevented()){
    e.preventDefault()
    $('#overlay').fadeIn(200)
    const host = $('#host').val()
    const user = $('#user').val()
    const pass = $('#pass').val()
    const protocol = $('#protocol').val()
    try{
      await window.ssh.connect({ host, username: user, password: pass, protocol })
      $('#overlay').fadeOut(200)
    }catch(err){
      $('#overlay').fadeOut(200)
      alert('Connection failed: ' + err.message)
    }
  }
})

term.onData(data => { window.ssh.sendInput(data) })
window.ssh.onOutput(data => { term.write(data) })
window.ssh.onStatus(status => { term.writeln('\r\n' + status + '\r\n') })
