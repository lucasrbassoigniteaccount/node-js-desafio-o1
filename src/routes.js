import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const users = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({ message: 'title is required' }),
        )
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({message: 'description is required' })
        )
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at : null,
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title , description  } = req.body

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({ message: 'title is required' }),
        )
      }

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({ message: 'title or description are required' })
        )
      }

      database.update('tasks', id, {
        title,
        description,
        updated_at: new Date().toISOString()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
    
      const tasks = database.select('tasks', {
        id,
      })

      if (!tasks[0]) {
        return res.writeHead(404).end()
      }

      
      database.update('tasks', id, {
        updated_at: new Date().toISOString(),
        completed_at: !tasks[0].completed_at ? new Date().toISOString() : null
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  }
]
