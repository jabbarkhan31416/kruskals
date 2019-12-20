
// x is vertical axis, increases from top to bottom
// y is horizontal axis, increases from left to right
const xSize = 15
const ySize = 15
const wallChar = "██"
const spaceChar = "  "

class Block{
  constructor(x,y){
    this.x = x
    this.y = y
    this.counted = null
    this.connected = null
    this.parent = this
    this.rank = 0
    this.connections = []
  }
}
const root = block=>{
  let r = block
  while(r!=r.parent) r = r.parent
  let c = block
  while(c!=r) [c, c.parent] = [c.parent, r]
  return r
}
const join = (a,b)=>{
  const rootA = root(a)
  const rootB = root(b)
  if(rootA == rootB) return false
  else if(rootA.rank < rootB.rank) return join(b,a)
  else{
    if(rootA.rank == rootB.rank) rootA.rank = rootA.rank+1
    rootB.rank = 0
    rootB.parent = rootA
    return rootA
  }
}
const blockArray = (new Array(xSize*2 + 1)).fill(0).map((_,i)=>(
  (new Array(ySize*2 + 1)).fill(0).map((_,j)=>(
    new Block(i,j)
  ))
))
let wallArray = []
let forestCount = 0
const reset = ()=>(
  blockArray.forEach((arr,i)=>(
    arr.forEach((o,j)=>(
      o.counted = (
        i==0 ? true :
        i == xSize*2 ? true :
        j==0 ? true :
        j == ySize*2 ? true :
        (~i^j) & 1 ? true :
        false
      ),
      o.connected = (
        (~i|~j) & 1 ? true : false
      ),
      o.connections = (
        i==0 ? [] :
        i == xSize*2 ? [] :
        j==0 ? [] :
        j == ySize*2 ? [] :
        i&1 && ~j&1 ? [blockArray[i][j-1], blockArray[i][j+1]] :
        j&1 && ~i&1 ? [blockArray[i-1][j], blockArray[i+1][j]] :
        []
      ),
      o.rank = 0,
      o.parent = o
    ))
  )),
  wallArray = (new Array((xSize*2+1) * (ySize*2+1))).fill(0).map((_,i)=>(
    blockArray[
      Math.floor(i / (ySize*2+1))
    ][
      i % (ySize*2+1)
    ]
  )).filter(o => !o.counted),
  forestCount = xSize*ySize,
  undefined
)
const render = ()=>(
  blockArray.map(a=>(
    a.map(x=>(
      x.connected ? wallChar : spaceChar
    )).join("")
  )).join("\n")
)
const update = ()=>{
  const l = wallArray.length - 1
  const r = Math.min(
    Math.floor(Math.random() * wallArray.length),
    l
  )
  if(join(...(wallArray[r].connections))){
    forestCount = forestCount-1
    wallArray[r].counted = true
    wallArray[r].connected = false
  }
  [wallArray[r], wallArray[l]] = [wallArray[l], wallArray[r]]
  wallArray.pop()
}

reset()
while(forestCount>1) update()
console.log(render())
