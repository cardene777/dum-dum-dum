local ao = require(".ao") -- this is AOS 2.x

Handlers.add(
  "CronTick",
  Handlers.utils.hasMatchingTag("Action", "Cron"),
  function (msg)
    ao.send({ Target = '89HBqWgMIm0lj8z9-i5BX9g4K4cYo2VvkVFkf-oLIbs', Tags = { Action = 'Proxy-Execute' } })
    ao.send({ Target = 'bVB-yDROg4G0K3joVXfyGkXPzco2lwryH13DXm7DqIQ', Tags = { Action = 'Proxy-Register' } })
    ao.send({ Target = 'kVODHqKh-AwXEw1n3qLu8c1ms491Z1pKCJWzKTgO3m0', Tags = { Action = 'Proxy-Register' } })
    ao.send({ Target = 'o_u2iwynwSkGoAk1w3rprNXIsENyAliYdKsQmemAKDs', Tags = { Action = 'Proxy-Register' } })
    ao.send({ Target = 'ZyQy3HWNOihK3qzTdVHnMdM2KQQvdYzweUzKh3zV0OA', Tags = { Action = 'Proxy-Register' } })
    ao.send({ Target = 'RKqQwaOvVaEbeHAlDSEiT8Lwxvc0YrY08KdmV1NcfGA', Tags = { Action = 'Proxy-Register' } })
  end
)
