import { CartIconService } from '../../main/js/services/index.js';

jest.useFakeTimers()
jest.spyOn(global, 'setTimeout');

describe('CartIconService', () => {
  let cartIconService

  beforeEach(() => {
    const mockDocument = {
      querySelector: jest.fn(),
      getElementById: jest.fn(),
    }

    mockDocument.querySelector.mockReturnValue({
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
      }
    })

    mockDocument.getElementById.mockReturnValue({
      innerHTML: ''
    })

    cartIconService = new CartIconService(mockDocument)
  })

  describe('#animateCartIcon', () => {
    test('should add "new-product" class to badge element and remove it after 500ms', () => {
      cartIconService.animateCartIcon()

      expect(cartIconService.document.querySelector).toHaveBeenCalledWith('#cart-button span.badge')
      expect(cartIconService.document.querySelector().classList.add).toHaveBeenCalledWith('new-product')
      expect(setTimeout).toHaveBeenCalledTimes(1)
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500)

      // Advance the timer by 500ms to trigger the callback
      jest.advanceTimersByTime(500)

      expect(cartIconService.document.querySelector().classList.remove).toHaveBeenCalledWith('new-product')
    })
  })

  describe('#setCartIconBadgeCount', () => {
    test('should set the badge counter element to the specified count', () => {
      cartIconService.setCartIconBadgeCount(5)

      expect(cartIconService.document.getElementById).toHaveBeenCalledWith('cart-badge-item-counter')
      expect(cartIconService.document.getElementById().innerHTML).toEqual(5)
    })
  })
})
