import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {

  async register({ request }: HttpContext) {
    const payload = request.all()
    const user = await User.create(payload)
    const token = await User.accessTokens.create(user)
    return {
      user,
      token: token.value!.release(),
    }
  }

  async login({ request }: HttpContext) {
    const { rationCardId, password } = request.only(['rationCardId', 'password'])
    const user = await User.verifyCredentials(rationCardId, password)
    const token = await User.accessTokens.create(user)
    return {
      user,
      token: token.value!.release(),
    }
  }

  async me({ auth }: HttpContext) {
    await auth.use('api').authenticate()
    return {
      user: auth.user
    }
  }

  async logout({ auth }: HttpContext) {
    await auth.use('api').authenticate()
    return { message: 'Logged out' }
  }
}
