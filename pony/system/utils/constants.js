
module.exports = {
  LIMIT_MIN: 1,
  LIMIT_MAX: 2147483647,
  SKIP_MIN: 0,
  SKIP_MAX: 2147483646,
  tables: {
    administrators: {
      auto_increment: true
    },
    dynaprice_entries: {
      auto_increment: true
    },
    entries: {
      auto_increment: false
    },
    consolidated: {
      auto_increment: true
    }
  },
  distanceSI: {
    km: Math.pow(10, 3),
    hm: Math.pow(10, 2),
    dam: Math.pow(10, 1),
    m: 1,
    dm: Math.pow(10, -1),
    cm: Math.pow(10, -2),
    mm: Math.pow(10, -3)
  },
  EPSILON: {
    inf: -2 * Math.pow(10, -6),
    sup:  2 * Math.pow(10, -6)
  }
}