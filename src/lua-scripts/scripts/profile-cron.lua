local json = require('json')
local ao = require("ao")

if Cron ~= '<Cron>' then Cron = '<Cron>' end
if DumDum ~= '<DumDum>' then DumDum = '<DumDum>' end
if Games ~= '<Games>' then Games = '<Games>' end

Handlers.add(
  'Proxy-Register',
  Handlers.utils.hasMatchingTag('Action', 'Proxy-Register'),
  function(msg)
    assert(msg.From == Cron, "only cron can execute")
    ao.send({
	Target = Games,
	Action = 'Register',
	Data = json.encode({ ['Asset-ID'] = DumDum })
    })
  end
)
