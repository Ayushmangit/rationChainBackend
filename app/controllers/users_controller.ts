import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {

  async register({ request }: HttpContext) {
    const { fullName, email } = request.only([
      'fullName',
      'email'
    ])

    const user = await User.create({
      fullName,
      email,
    })

    const token = await User.accessTokens.create(user)

    return {
      user,
      token: token.value!.release(),
    }
  }

  async login({ request }: HttpContext) {
    const { bid, password } = request.only(['bid', 'password'])
    const user = await User.verifyCredentials(bid, password)
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
