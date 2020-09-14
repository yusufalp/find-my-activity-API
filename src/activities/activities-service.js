const ActivitiesService = {
  getAllActivities(knex) {
    return knex.select('*').from('activities')
  },
  insertActivity(knex, newActivity) {
    return knex
      .insert(newActivity)
      .into('activities')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex
      .select('*')
      .from('activities')
      .where('id', id)
      .then(rows => {
        return rows[0]
      })
  }
}

module.exports = ActivitiesService;