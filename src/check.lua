-- @fileOverview
-- @name check.lua
-- @author Liu Chong
-- @license MIT

-- expire time in milliseconds

-- solution 1:
-- local key = KEYS[1]
-- local limit = tonumber(ARGV[1])
-- local pexp = ARGV[2]

-- local curr = tonumber(redis.call("INCR", key))
-- if curr == 1 then
--   redis.call("PEXPIRE", key, pexp)
-- end
-- return curr

-- solution 2:
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local pexp = tonumber(ARGV[2])

local pttl = tonumber(redis.call("PTTL", key))
if pttl == -1 or pttl > pexp then
  redis.call("PEXPIRE", key, pexp)
elseif pttl == -2 then
  redis.call("PSETEX", key, pexp, limit)
end

return tonumber(redis.call("DECR", key))
