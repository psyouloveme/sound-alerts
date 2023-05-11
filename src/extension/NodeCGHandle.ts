import { type NodeCG } from 'nodecg-types/types/server'

interface Handle<T> {
  current: T | null
}

const nodecgHandle: Handle<NodeCG> = {
  current: null
}

export default nodecgHandle
