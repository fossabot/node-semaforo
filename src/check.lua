-- @fileOverview
-- @name check.lua
-- @author Liu Chong
-- @license MIT

-- expire time in milliseconds

local key = KEYS[1]
local limit = tonumber(ARGV[1])
local pexp = tonumber(ARGV[2])

local pttl = tonumber(redis.call("PTTL", key))

-- -1 if the key exists but has no associated expire
-- -2 if the key does not exist

if pttl == -1 or pttl > pexp then
  -- fix limit number if need
  local lim = tonumber(redis.call("GET", key))
  if lim == nil or lim > limit then
    redis.call("SET", key, limit)
  end
  -- fix expire time if not did set or been set to a wrong number
  redis.call("PEXPIRE", key, pexp)
elseif pttl == -2 then
  -- set a key with expire time
  redis.call("PSETEX", key, pexp, limit)
end

-- decrease the number of key and return the remained
return tonumber(redis.call("DECR", key))
