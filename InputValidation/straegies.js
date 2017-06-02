// todo: 现在的验证strat是启动所有验证，如何根据不同的dom来区分不同的验证规则。

// 验证规则中心
let strategies = {
  isNonEmpty(value, errMSG) {
    if (value === '') {
      return errMSG;
    }
  },

  minLength(value, length, errMSG) {
    if (value.length >= length) {
      return errMSG;
    }
  },

  isMobile(value, errMSG) {
    if (!/(^1[3|5|7|8][0-9]{9}$)/.test(value)) {
      return errMSG;
    }
  },
}

// 验证规则集中管理
class Manage {
  constructor() {
    this.cache = []
    this.i = 0
  }
/**
 * 添加验证规则
 * @param {[str]} dom   [dom输入的数据]
 * @param {[obj]} rules [需要添加的验证规则]
 */
  add(dom, rules) {
    dom.setAttribute('data-mangeid', ++this.i)
    for ( let rule of rules ) {
      let arr = [];
      arr.push(()=> {
        let strategAry = rule.strategy.split(':');
        let errMSG = rule.errMSG;
        let stateg = strategAry.shift(); // 提取规则

        strategAry.unshift(dom.value); // 将value放入首位
        strategAry.push(errMSG);
        return  strategies[stateg].apply(dom, strategAry)
      })
      if(this.cache[this.i]) {
        this.cache[this.i] = this.cache[this.i].concat(arr);
      } else {
        this.cache[this.i] = arr;
      }
    }
  }

  start() {
    let cache = this.cache;
    let ele = arguments[0];
    for(let i = 1, len = this.cache.length; i < len; i++) {
      if (ele && ele.dataset.mangeid) {
        if (ele.dataset.mangeid != i)
        continue
      }
      for (let stategfun of this.cache[i]) {
        let errMSG = stategfun();
        if (errMSG) {
          return errMSG;
        }
      }
    }
  }
}
