local json = require('json')
local ao = require("ao")
if Cron ~= '<Cron>' then Cron = '<Cron>' end

local function getGameID(timestamp)
  return tostring(math.ceil((timestamp - tonumber(origin)) / span))
end

Handlers.add(
  'Proxy-Execute',
  Handlers.utils.hasMatchingTag('Action', 'Proxy-Execute'),
  function(msg)
    assert(msg.From == Cron, "only cron can execute")
    assert(init == true and init_guns == true, "game has not been initialized")
    local id = tostring(tonumber(getGameID(msg.Timestamp)) - 1)
    assert(games[id] ~= nil, "game does not exist!")
    assert(games[id].executed == false, "already executed!")
    assert(games[id].numbers == nil, "numbers are already generated!")
    games[id].numbers = {}
    local numbers = {}
    math.randomseed(msg.Timestamp)
    for i = 0, 2, 1 do
      table.insert(numbers, math.random(0, 100))
    end
    local tags = { ID = id }
    ao.send({
	Target = ao.id,
	Action = 'Complete-Game',
	Tags = tags,
	Data = json.encode(numbers)
    })
    Handlers.utils.reply('executed!')(msg) 
  end
)
