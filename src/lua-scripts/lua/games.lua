local json = require('json')
local ao = require("ao")
local crypto = require(".crypto");

-- Initialize
games = games or {}
origin = orign or nil
span = span or 1000 * 60 * 60 * 24
dumdum = dumdum or '<DUMDUM>'
gun = gun or '<GUN>'
dumdums = dumdums or {}
guns = guns or {}
init = init or false
init_guns = int_guns or false

-- Generate Game ID
local function getGameID(timestamp)
  return tostring(math.ceil((timestamp - tonumber(origin)) / span))
end

-- Generate Game ID Handler
Handlers.add(
  'GameID',
  Handlers.utils.hasMatchingTag('Action', 'GameID'),
  function(msg)
    assert(origin ~= nil, 'origin not set!')
    ao.send({
	Target = msg.From,
	Action = 'Read-Success',
	Tags = { ID = getGameID(msg.Timestamp), Timestamp = tostring(msg.Timestamp), Origin = origin, Span = tostring(span) }
    })
  end
)

-- Initialize Game
Handlers.add(
  'Init',
  function(msg)
    return msg.From == dumdum
  end,
  function(msg)
    --assert(init == false, "already initialized")
    local assets = json.decode(msg.Data).Assets
    for i, val in ipairs(assets) do
      dumdums[val] = dumdums[val] or { score = 0, guns = {} }
    end
    init = true
  end
)

-- Initialize Guns
Handlers.add(
  'Init-Guns',
  function(msg)
    return msg.From == gun
  end,
  function(msg)
    --assert(init_guns == false, "already initialized")
    local assets = json.decode(msg.Data).Assets
    for i, val in ipairs(assets) do
      guns[val] = guns[val] or { active = true }
    end
    init_guns = true
  end
)

-- Set Origin
-- This handler sets the starting criteria (origin) and duration (span) of the game.
-- It can only be executed by the process owner.
-- It checks that the origin and span data are in the correct format and sets them only if they are not already set.
-- When the configuration is complete, it sends an Info action to the relevant component, which replies with a message that the configuration is complete.
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

-- Equip Gun for Dumdum
-- Equips the specified asset (dumdum) with a gun (gun).
-- Before execution, it checks the initialization state of the game and gun, the message content, the existence of the asset and gun to be equipped, and whether they can be equipped.
-- If the asset and gun are successfully equipped, the state of the asset and gun are updated and a response is sent back to the executor.
-- This process provides the ability to equip items to characters in the game.
Handlers.add(
  'Update-Assets',
  Handlers.utils.hasMatchingTag('Action', 'Update-Assets'),
  function(msg)
    assert(msg.From == ao.env.Process.Owner, 'only process owner can execute!')
    ao.send({
	Target = dumdum,
	Action = 'Info',
    })
    ao.send({
	Target = gun,
	Action = 'Info',
    })
    Handlers.utils.reply('assets updated!')(msg) 
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

-- Register Dumdum
-- To register a player (dumdum asset) in the game.
-- Various conditions are checked, such as whether the game and gun are initialized, whether the asset ID is correct, and whether the player has already been registered.
-- If the registration is successful, the player's information is stored in the games table and a success response is returned to the requestor.
-- It also sends a balances action to check the status of the asset.
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
    assert(msg.Tags.Force == "1" or tonumber(msg.Tags.ID) < tonumber(id), "the game has not ended!")
    assert(games[msg.Tags.ID].numbers == nil, "numbers are already generated!")
    games[msg.Tags.ID].numbers = {}
    local numbers = {}
    math.randomseed(msg.Timestamp)
    for i = 0, 2, 1 do
      table.insert(numbers, math.random(0, 100))
    end
    local tags = { ID = msg.Tags.ID }
    if msg.Tags.Force == "1" then
      tags.Force = "1"
    end
    ao.send({
	Target = ao.id,
	Action = 'Complete-Game',
	Tags = tags,
	Data = json.encode(numbers)
    })
    Handlers.utils.reply('executed!')(msg)
  end
)


local shuffle = function(vals, nums)
  for i = 1, #vals do
    local j = nums[i % #nums + 1] % #vals + 1
    vals[i], vals[j] = vals[j], vals[i]
  end
  return vals
end

Handlers.add(
  'Complete-Game',
  Handlers.utils.hasMatchingTag('Action', 'Complete-Game'),
  function(msg)
    assert(msg.From == ao.id, "only process itself can execute!")
    assert(init == true and init_guns == true, "game has not been initialized!")
    assert(math.type(tonumber(msg.Tags.ID)) == 'integer', 'ID is required!')
    assert(games[msg.Tags.ID] ~= nil, "game does not exist!")
    assert(games[msg.Tags.ID].executed == false, "already executed!")
    local id = getGameID(msg.Timestamp)
    assert(msg.Tags.Force == "1" or tonumber(msg.Tags.ID) < tonumber(id), "the game has not ended!")
    local numbers = json.decode(msg.Data)
    games[msg.Tags.ID].numbers = numbers
    games[msg.Tags.ID].executed = true
    local attacks = {}
    for key, val in pairs(games[msg.Tags.ID].players) do
      if val.pending == false then
	attacks[key] = attacks[key] or 0
	local guns = {}
	for key2, val2 in pairs(val.guns) do
	  table.insert(guns, { id = key2, val = val2 })
	end
	guns = shuffle(guns, numbers)
	local i = 0
	for i2, val2 in ipairs(guns) do
	  if i < 3 then
	    attacks[key] = attacks[key] + val2.val.attack
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
