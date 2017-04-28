export const observeArray = (array, arrayChangeHandler={
      get: (t,p)=>t[p], 
      set: (t,p,v)=>{t[p]=v; return true}
    }) => new Proxy([], arrayChangeHandler)