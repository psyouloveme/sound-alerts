import { NodeCG } from "nodecg-types/types/server";

type Handle<T> = {
	current: T | null;
};

const nodecgHandle : Handle<NodeCG> = {
	current: null
};

export default nodecgHandle;