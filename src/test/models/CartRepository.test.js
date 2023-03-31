import { CartRepository, Cart } from '../../main/js/models/index.js'

describe('CartRepository', () => {
  let cartRepository

  beforeEach(() => {
    cartRepository = new CartRepository('test-cart-key')
  })

  afterEach(() => {
    localStorage.removeItem('test-cart-key')
  })

  describe('#getCart', () => {
    test('should return a new cart if none exists in localStorage', () => {
      const cart = cartRepository.getCart()

      expect(cart).toBeInstanceOf(Cart)
      expect(localStorage.getItem('test-cart-key')).not.toBeNull()
    })

    test('should return the existing cart from localStorage', () => {
      const existingCart = new Cart()
      localStorage.setItem('test-cart-key', JSON.stringify(existingCart))

      const cart = cartRepository.getCart()

      expect(cart).toEqual(existingCart)
    })
  })

  describe('#saveCart', () => {
    test('should save the cart to localStorage', () => {
      const cart = new Cart()

      cartRepository.saveCart(cart)

      expect(localStorage.getItem('test-cart-key')).toEqual(JSON.stringify(cart))
    })
  })

  describe('#deleteCart', () => {
    test('should remove the cart from localStorage', () => {
      const cart = new Cart()
      localStorage.setItem('test-cart-key', JSON.stringify(cart))

      cartRepository.deleteCart()

      expect(localStorage.getItem('test-cart-key')).toBeNull()
    })
  })
})
