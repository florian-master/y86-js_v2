import { KernelController } from '../../controllers/kernelController'

test("Test kernel controller", () => {
    let controller = new KernelController()

    expect(() => {
        controller.useKernel("test")
    }).toThrow()
})