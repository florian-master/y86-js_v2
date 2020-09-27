import { Hcl2js } from '../../model/hcl2js/hcl2js'

test('hcl2js simple program', () => {
    let hcl = `
    intsig valb 'VALB'
    intsig icode 'ICODE'
    
    bool f = icode in {valb, 3};
    
    int a = 3;
    `

    let hcl2js = new Hcl2js()
    let result = hcl2js.assemble(hcl)

    expect(result.errors.length).toBe(0)

    hcl = `
    intsig valb 'VALB'
    intsig icode 'ICODE'
    
    bool f = random in {valb, 3};`

    result = hcl2js.assemble(hcl)
    expect(result.errors.length).not.toBe(0)
})

test('hcl2js complex program', () => {
    let hcl = `
            intsig true     '1'
            intsig false    '0'
            intsig ten      '10'

            bool f1 = ten in {[1: 10; 0: 15;]};
            bool f2 = ten in {[0: 10; 1: 15;]};
            bool f3 = 0 in {[0: 10; 0: 15;]};
        `

    let hcl2js = new Hcl2js()

    const result = hcl2js.assemble(hcl)
    expect(result.errors.length).toBe(0)

    let func = eval(result.output)
    expect(func.f1()).toBeTruthy()
    expect(func.f2()).toBeFalsy()
    expect(func.f3()).toBeTruthy()
})