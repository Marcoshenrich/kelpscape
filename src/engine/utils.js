


export const rand = (floor, ceil) => {
    if (!ceil) return Math.floor(Math.random() * floor)
    return Math.floor(Math.random() * (ceil - floor)) + floor + 1
}

export const miniRandomizer = () => {
    //to prevent pos collisions in the quad tree - if more than bucket limit share exact same pos, it recurses and breaks
    return Math.floor(Math.random() * 1000) / 1000
}

const tester = (ceil, floor) => {
    let resArr = []

    for (let i=0; i < 1000; i++) {
        resArr.push(rand(ceil, floor))
    }
    return [Math.min(...resArr), Math.max(...resArr)]

}


// some base class
class BaseClass { }
// SocialNetworkMixin
const floater = (superclass) => class extends superclass {
    
}

class MixinBuilder {
    constructor(superclass) {
        this.superclass = superclass;
    }
    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }
}

export const mix = (superclass) => new MixinBuilder(superclass);

// class Facebook extends mix(BaseClass).with(SocialNetwork, AdProvider) { }
