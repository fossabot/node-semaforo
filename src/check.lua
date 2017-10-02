-- @fileOverview
-- @name check.lua
-- @author Liu Chong
-- @license MIT

-- expire time in milliseconds

local key = KEYS[1]
local limit = tonumber(ARGV[1])
local pexp = tonumber(ARGV[2])

local pttl = tonumber(redis.call("PTTL", key))

-- explain pttl:
-- -1 if the key exists but has no associated expire
-- -2 if the key does not exist

if pttl < 0 or pttl > pexp then
  -- re-set key with expire time
  redis.call("PSETEX", key, pexp, limit)
end

-- decrease the number of key and return the remained
return tonumber(redis.call("DECR", key))
