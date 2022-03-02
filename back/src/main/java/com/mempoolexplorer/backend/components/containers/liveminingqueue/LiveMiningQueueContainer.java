package com.mempoolexplorer.backend.components.containers.liveminingqueue;

import com.mempoolexplorer.backend.entities.miningqueue.LiveMiningQueue;

public interface LiveMiningQueueContainer {

	// Can return null if service is not initialized yet
	LiveMiningQueue atomicGet();

	void setAllowRefresh(boolean allowRefresh);

	boolean isAllowRefresh();

	void refreshIfNeeded();

	void forceRefresh();

	void drop();
}
