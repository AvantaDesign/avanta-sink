import { z } from 'zod'

const { select } = SqlBricks

export default eventHandler(async (event) => {
  const { ids } = await getValidatedQuery(event, z.object({
    ids: z.string().trim().optional(),
  }).parse)

  if (!ids) {
    return {}
  }

  try {
    const { dataset } = useRuntimeConfig(event)
    const idArray = ids.split(',').filter(Boolean)

    if (idArray.length === 0) {
      return {}
    }

    const sql = select('index1 as id, SUM(_sample_interval) as count')
      .from(dataset)
      .where(SqlBricks.in('index1', idArray))
      .groupBy('index1')
      .toString()

    const results = await useWAE(event, sql)

    // Convert results array to object keyed by id
    const clickCounts: Record<string, number> = {}
    if (Array.isArray(results)) {
      for (const result of results) {
        if (result.id) {
          clickCounts[result.id] = result.count || 0
        }
      }
    }

    return clickCounts
  }
  catch (error) {
    console.error('Failed to fetch click counts:', error)
    return {}
  }
})
