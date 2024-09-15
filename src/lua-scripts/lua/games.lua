local json = require('json')
local ao = require("ao")

games = games or {}
origin = orign or nil
span = span or 1000 * 60 * 60 * 24
dumdum = dumdum or '<DUMDUM>'
gun = guns or '<GUN>'
dumdums = dumdums or {}
guns = guns or {}
init = init or false
init_guns = int_guns or false

local function getGameID(timestamp)
  return tostring(math.ceil((timestamp - tonumber(origin)) / span))
end

Handlers.add(
  'GameID',
  Handlers.utils.hasMatchingTag('Action', 'GameID'),
  function(msg)
    assert(origin ~= nil, 'origin not set!')
    ao.send({
	Target = msg.From,
	Action = 'Read-Success',
	Tags = { ID = getGameID(msg.Timestamp) }
    })
  end
)

Handlers.add(
  'Init',
  function(msg)
    return msg.From == dumdum
  end,
  function(msg)
    assert(init == false, "already initialized")
    local assets = json.decode(msg.Data).Assets
    for i, val in ipairs(assets) do
      dumdums[val] = dumdums[val] or { score = 0, guns = {} }
    end
    init = true
  end
)

Handlers.add(
  'Init-Guns',
  function(msg)
    return msg.From == gun
  end,
  function(msg)
    assert(init_guns == false, "already initialized")
    local assets = json.decode(msg.Data).Assets
    for i, val in ipairs(assets) do
      guns[val] = guns[val] or { active = true }
    end
    init_guns = true
  end
)

Handlers.add(
  'Set-Origin',
  Handlers.utils.hasMatchingTag('Action', 'Set-Origin'),
  function(msg)
    assert(msg.From == ao.env.Process.Owner, 'only process owner can execute!')
    assert(type(msg.Tags.Origin) == "string", 'Origin is required!')
    assert(math.type(tonumber(msg.Tags.Span)) == 'integer', 'Span is required!')
    assert(origin == nil, 'origin exists!')
    origin = msg.Tags.Origin
    span = tonumber(msg.Tags.Span)
    ao.send({
	Target = dumdum,
	Action = 'Info',
    })
    ao.send({
	Target = gun,
	Action = 'Info',
    })
    Handlers.utils.reply('origin set!')(msg) 
  end
)

Handlers.add(
  'Equip',
  Handlers.utils.hasMatchingTag('Action', 'Equip'),
  function(msg)
    assert(init == true and init_guns == true, "game has not been initialized")
    local json = json.decode(msg.Data)
    local id = json['Asset-ID']
    assert(type(id) == "string", 'Asset-ID is required!')
    assert(dumdums[id] ~= nil, 'Asset is not dumdum!')
    local gun_id = json['Gun-ID']
    assert(type(gun_id) == "string", 'Gun-ID is required!')
    assert(guns[gun_id] ~= nil, 'Asset is not gun!')
    assert(guns[gun_id].asset == nil and guns[gun_id].pending ~= true, 'Gun is already equipped!')
    guns[gun_id].pending = true
    guns[gun_id].owner = msg.From
    guns[gun_id].asset = id
    ao.send({
	Target = msg.From,
	Action = 'Action-Response',
	Tags = { Status = "Success", Message = gameID, Handler = "Equipped" }
    })
    ao.send({
	Target = gun_id,
	Action = 'Info',
    })
  end
)

Handlers.add(
  'Register',
  Handlers.utils.hasMatchingTag('Action', 'Register'),
  function(msg)
    assert(init == true and init_guns == true, "game has not been initialized")
    local json = json.decode(msg.Data)
    local id = json['Asset-ID']
    assert(type(id) == "string", 'Asset-ID is required!')
    assert(dumdums[id] ~= nil, 'Asset is not dumdum!')
    local gameID = getGameID(msg.Timestamp)
    games[gameID] = games[gameID] or { players = {}, guns = {}, executed = false }
    assert(games[gameID].players[id] == nil, "already registered!")
    games[gameID].players[id] = { guns = {}, pending = true, owner = msg.From }
    ao.send({
	Target = msg.From,
	Action = 'Action-Response',
	Tags = { Status = "Success", Message = gameID, Handler = "Registered" }
    })
    ao.send({
	Target = id,
	Action = 'Balances',
    })
  end
)

Handlers.add(
  'Get-Game',
  Handlers.utils.hasMatchingTag('Action', 'Get-Game'),
  function(msg)
    assert(init == true and init_guns == true, "game has not been initialized")
    assert(math.type(tonumber(msg.Tags.ID)) == 'integer', 'ID is required!')
    ao.send({
	Target = msg.From,
	Action = 'Read-Success',
	Tags = { Game = json.encode(games[msg.Tags.ID]) }
    })
  end
)

Handlers.add(
  'Get-Ranking',
  Handlers.utils.hasMatchingTag('Action', 'Get-Ranking'),
  function(msg)
    assert(init == true and init_guns == true, "game has not been initialized")
    local arr = {}
    for key, val in pairs(dumdums) do
      table.insert(arr, {id = key, guns = val.guns, score = val.score})
    end
    table.sort(
      arr,
      function(a, b)
	return a.score > b.score
      end
    )

    ao.send({
	Target = msg.From,
	Action = 'Ranking',
	Data = json.encode(arr)
    })
  end
)

Handlers.add(
  'Execute',
  Handlers.utils.hasMatchingTag('Action', 'Execute'),
  function(msg)
    assert(init == true and init_guns == true, "game has not been initialized")
    assert(math.type(tonumber(msg.Tags.ID)) == 'integer', 'ID is required!')
    assert(games[msg.Tags.ID] ~= nil, "game does not exist!")
    assert(games[msg.Tags.ID].executed == false, "already executed!")
    local id = getGameID(msg.Timestamp)
    assert(tonumber(msg.Tags.ID) < tonumber(id), "the game has not ended!")
    games[msg.Tags.ID].executed = true

    local attacks = {}
    for key, val in pairs(games[msg.Tags.ID].players) do
      if val.pending == false then
	attacks[key] = attacks[key] or 0
	local i = 0
	for key2, val2 in pairs(val.guns) do
	  if i < 3 then
	    attacks[key] = attacks[key] + val2.attack
	  end
	  i = i + 1
	end
      end
    end

    local arr = {}
    for key, val in pairs(attacks) do
      table.insert(arr, {id = key, attack = val})
    end
    table.sort(
      arr,
      function(a, b)
	return a.attack > b.attack
      end
    )
    for i, val in ipairs(arr) do
      if i < 10 then
	dumdums[val.id].score = dumdums[val.id].score + (10 - i)
      end
    end
    games[msg.Tags.ID].result = attacks
    Handlers.utils.reply('executed!')(msg) 
  end
)

local function decode_message_data(data)
  local status, decoded_data = pcall(json.decode, data)

  if not status or type(decoded_data) ~= 'table' then
    return false, nil
  end

  return true, decoded_data
end


Handlers.add(
  'Read-Success',
  Handlers.utils.hasMatchingTag('Action', 'Read-Success'),
  function(msg)
    assert(guns[msg.From] ~= nil or dumdums[msg.From] ~= nil, "not dumdum or gun!")
    if guns[msg.From] ~= nil then
      assert(guns[msg.From].pending == true, "gun not registered!")
      local data = json.decode(msg.Data)
      local owner = nil
      for key, val in pairs(data.Balances) do
	if tonumber(val) > 0 then
	  owner = key
	end
      end
      assert(guns[msg.From].owner == owner, "the wrong owner!")
      dumdums[guns[msg.From].asset].guns[msg.From] = {
	attack = data.Attack
      }
    else
      local id = getGameID(msg.Timestamp)
      assert(games[id] ~= nil, "game does not exist!")
      assert(games[id].players[msg.From] ~= nil, "dumdum not registered")
      local owner = games[id].players[msg.From].owner
      local balances = json.decode(msg.Data)
      local exist = false
      for key, val in pairs(balances) do
	if key == owner then
	  exist = true
	  if tonumber(val) > 0 then
	    for key, val in pairs(dumdums[msg.From].guns) do
	      if games[id].guns[key] == nil then
		games[id].guns[key] = msg.From
		games[id].players[msg.From].guns[key] = val
	      end
	    end
	    games[id].players[msg.From].pending = false
	  else
	    games[id].players[msg.From] = nil
	  end
	end
      end
      if exist == false then
	games[id].players[msg.From] = nil
      end
    end
  end
)

Handlers.add(
  'Run-Action',
  Handlers.utils.hasMatchingTag('Action', 'Run-Action'),
  function(msg)
    local decode_check, data = decode_message_data(msg.Data)
    ao.send({
	Target = data.Target,
	Action = data.Action,
	Data = data.Input
    })
end)