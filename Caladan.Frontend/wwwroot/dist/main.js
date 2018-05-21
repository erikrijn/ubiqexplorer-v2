/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "aaa37fded62d699866a6"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(73)(__webpack_require__.s = 73);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(6);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var Vue // late bind
var version
var map = window.__VUE_HOT_MAP__ = Object.create(null)
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) return
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
      'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Vue.extend(options),
    instances: []
  }
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot (id, options) {
  injectHook(options, initHookName, function () {
    map[id].instances.push(this)
  })
  injectHook(options, 'beforeDestroy', function () {
    var instances = map[id].instances
    instances.splice(instances.indexOf(this), 1)
  })
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook (options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing)
      ? existing.concat(hook)
      : [existing, hook]
    : [hook]
}

function tryWrap (fn) {
  return function (id, arg) {
    try { fn(id, arg) } catch (e) {
      console.error(e)
      console.warn('Something went wrong during Vue component hot-reload. Full reload required.')
    }
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  record.Ctor.options.render = options.render
  record.Ctor.options.staticRenderFns = options.staticRenderFns
  record.instances.slice().forEach(function (instance) {
    instance.$options.render = options.render
    instance.$options.staticRenderFns = options.staticRenderFns
    instance._staticTrees = [] // reset static trees
    instance.$forceUpdate()
  })
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (version[1] < 2) {
      // preserve pre 2.2 behavior for global mixin handling
      record.Ctor.extendOptions = options
    }
    var newCtor = record.Ctor.super.extend(options)
    record.Ctor.options = newCtor.options
    record.Ctor.cid = newCtor.cid
    record.Ctor.prototype = newCtor.prototype
    if (newCtor.release) {
      // temporary global mixin strategy used in < 2.0.0-alpha.6
      newCtor.release()
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn('Root or manually mounted instance modified. Full reload required.')
    }
  })
})


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = Object.create(options.computed || null)
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
    options.computed = computed
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** vue-property-decorator verson 5.1.0 MIT LICENSE copyright 2017 kaorun343 */

Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = __webpack_require__(0);
exports.Vue = vue_1.default;
var vue_class_component_1 = __webpack_require__(39);
exports.Component = vue_class_component_1.default;
__webpack_require__(34);
/**
 * decorator of an inject
 * @param key key
 * @return PropertyDecorator
 */
function Inject(key) {
    return vue_class_component_1.createDecorator(function (componentOptions, k) {
        if (typeof componentOptions.inject === 'undefined') {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            componentOptions.inject[k] = key || k;
        }
    });
}
exports.Inject = Inject;
/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
function Provide(key) {
    return vue_class_component_1.createDecorator(function (componentOptions, k) {
        var provide = componentOptions.provide;
        if (typeof provide !== 'function' || !provide.managed) {
            var original_1 = componentOptions.provide;
            provide = componentOptions.provide = function () {
                var rv = Object.create((typeof original_1 === 'function' ? original_1.call(this) : original_1) || null);
                for (var i in provide.managed)
                    rv[provide.managed[i]] = this[i];
                return rv;
            };
            provide.managed = {};
        }
        provide.managed[k] = key || k;
    });
}
exports.Provide = Provide;
/**
 * decorator of model
 * @param  event event name
 * @return PropertyDecorator
 */
function Model(event) {
    return vue_class_component_1.createDecorator(function (componentOptions, prop) {
        componentOptions.model = { prop: prop, event: event || prop };
    });
}
exports.Model = Model;
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function Prop(options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        if (!Array.isArray(options) && typeof options.type === 'undefined') {
            options.type = Reflect.getMetadata('design:type', target, key);
        }
        vue_class_component_1.createDecorator(function (componentOptions, k) {
            (componentOptions.props || (componentOptions.props = {}))[k] = options;
        })(target, key);
    };
}
exports.Prop = Prop;
/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
function Watch(path, options) {
    if (options === void 0) { options = {}; }
    var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
    return vue_class_component_1.createDecorator(function (componentOptions, handler) {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null);
        }
        componentOptions.watch[path] = { handler: handler, deep: deep, immediate: immediate };
    });
}
exports.Watch = Watch;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = vendor_c407fb26a4b20940f64d;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)();
// imports


// module
exports.push([module.i, "/* ==============================================================\r\n\r\nTemplate name : Bootsnav - Multi Purpose Header\r\nCategorie : Bootstrap Menu in CSS\r\nAuthor : adamnurdin01\r\nVersion : v.1.2\r\nCreated : 2016-06-02\r\nLast update : 2016-10-19\r\n\r\n============================================================== */\r\n\r\n/* MEGAMENU STYLE\r\n=================================*/\r\nnav.bootsnav .dropdown.megamenu-fw {\r\n    position: static;\r\n}\r\n\r\nnav.bootsnav .container {\r\n    position: relative;\r\n}\r\n\r\nnav.bootsnav .megamenu-fw .dropdown-menu {\r\n    left: auto;\r\n}\r\n\r\nnav.bootsnav .megamenu-content {\r\n    padding: 15px;\r\n    width: 100% !important;\r\n}\r\n\r\n    nav.bootsnav .megamenu-content .title {\r\n        margin-top: 0;\r\n    }\r\n\r\nnav.bootsnav .dropdown.megamenu-fw .dropdown-menu {\r\n    left: 0;\r\n    right: 0;\r\n}\r\n\r\n/* Navbar\r\n=================================*/\r\nnav.navbar.bootsnav {\r\n    margin-bottom: 0;\r\n    -moz-border-radius: 0px;\r\n    -webkit-border-radius: 0px;\r\n    -o-border-radius: 0px;\r\n    border-radius: 0px;\r\n    background-color: #fff;\r\n    border: none;\r\n    border-bottom: solid 1px #f1f1f1;\r\n    z-index: 9;\r\n}\r\n\r\n    nav.navbar.bootsnav ul.nav > li > a {\r\n        color: #6f6f6f;\r\n        background-color: transparent;\r\n        outline: none;\r\n        margin-bottom: -2px;\r\n    }\r\n\r\n    nav.navbar.bootsnav ul.nav li.megamenu-fw > a:hover,\r\n    nav.navbar.bootsnav ul.nav li.megamenu-fw > a:focus,\r\n    nav.navbar.bootsnav ul.nav li.active > a:hover,\r\n    nav.navbar.bootsnav ul.nav li.active > a:focus,\r\n    nav.navbar.bootsnav ul.nav li.active > a {\r\n        background-color: transparent;\r\n    }\r\n\r\n    nav.navbar.bootsnav .navbar-toggle {\r\n        background-color: #fff;\r\n        border: none;\r\n        padding: 0;\r\n        font-size: 18px;\r\n        position: relative;\r\n        top: 5px;\r\n    }\r\n\r\n    nav.navbar.bootsnav ul.nav .dropdown-menu .dropdown-menu {\r\n        top: 0;\r\n        left: 100%;\r\n    }\r\n\r\n    nav.navbar.bootsnav ul.nav ul.dropdown-menu > li > a {\r\n        white-space: normal;\r\n    }\r\n\r\n\r\nul.menu-col {\r\n    padding: 0;\r\n    margin: 0;\r\n    list-style: none;\r\n}\r\n\r\n    ul.menu-col li a {\r\n        color: #6f6f6f;\r\n    }\r\n\r\n        ul.menu-col li a:hover,\r\n        ul.menu-col li a:focus {\r\n            text-decoration: none;\r\n        }\r\n\r\n/* Navbar Full\r\n=================================*/\r\nnav.bootsnav.navbar-full {\r\n    padding-bottom: 10px;\r\n    padding-top: 10px;\r\n}\r\n\r\n    nav.bootsnav.navbar-full .navbar-header {\r\n        display: block;\r\n        width: 100%;\r\n    }\r\n\r\n    nav.bootsnav.navbar-full .navbar-toggle {\r\n        display: inline-block;\r\n        margin-right: 0;\r\n        position: relative;\r\n        top: 0;\r\n        font-size: 30px;\r\n        -webkit-transition: all 4s ease-in-out;\r\n        -moz-transition: all 4s ease-in-out;\r\n        -o-transition: all 4s ease-in-out;\r\n        -ms-transition: all 4s ease-in-out;\r\n        transition: all 4s ease-in-out;\r\n    }\r\n\r\n    nav.bootsnav.navbar-full .navbar-collapse {\r\n        position: fixed;\r\n        width: 100%;\r\n        height: 100% !important;\r\n        top: 0;\r\n        left: 0;\r\n        padding: 0;\r\n        display: none !important;\r\n        z-index: 9;\r\n    }\r\n\r\n        nav.bootsnav.navbar-full .navbar-collapse.in {\r\n            display: block !important;\r\n        }\r\n\r\n        nav.bootsnav.navbar-full .navbar-collapse .nav-full {\r\n            overflow: auto;\r\n        }\r\n\r\n        nav.bootsnav.navbar-full .navbar-collapse .wrap-full-menu {\r\n            display: table-cell;\r\n            vertical-align: middle;\r\n            background-color: #fff;\r\n            overflow: auto;\r\n        }\r\n\r\n        nav.bootsnav.navbar-full .navbar-collapse .nav-full::-webkit-scrollbar {\r\n            width: 0;\r\n        }\r\n\r\n        nav.bootsnav.navbar-full .navbar-collapse .nav-full::-moz-scrollbar {\r\n            width: 0;\r\n        }\r\n\r\n        nav.bootsnav.navbar-full .navbar-collapse .nav-full::-ms-scrollbar {\r\n            width: 0;\r\n        }\r\n\r\n        nav.bootsnav.navbar-full .navbar-collapse .nav-full::-o-scrollbar {\r\n            width: 0;\r\n        }\r\n\r\n\r\n        nav.bootsnav.navbar-full .navbar-collapse ul.nav {\r\n            display: block;\r\n            width: 100%;\r\n            overflow: auto;\r\n        }\r\n\r\n            nav.bootsnav.navbar-full .navbar-collapse ul.nav a:hover,\r\n            nav.bootsnav.navbar-full .navbar-collapse ul.nav a:focus,\r\n            nav.bootsnav.navbar-full .navbar-collapse ul.nav a {\r\n                background-color: transparent;\r\n            }\r\n\r\n            nav.bootsnav.navbar-full .navbar-collapse ul.nav > li {\r\n                float: none;\r\n                display: block;\r\n                text-align: center;\r\n            }\r\n\r\n                nav.bootsnav.navbar-full .navbar-collapse ul.nav > li > a {\r\n                    display: table;\r\n                    margin: auto;\r\n                    text-transform: uppercase;\r\n                    font-weight: bold;\r\n                    letter-spacing: 2px;\r\n                    font-size: 24px;\r\n                    padding: 10px 15px;\r\n                }\r\n\r\nli.close-full-menu > a {\r\n    padding-top: 0px;\r\n    padding-bottom: 0px;\r\n}\r\n\r\nli.close-full-menu {\r\n    padding-top: 30px;\r\n    padding-bottom: 30px;\r\n}\r\n\r\n/* Atribute Navigation\r\n=================================*/\r\n.attr-nav {\r\n    float: right;\r\n    display: inline-block;\r\n    margin-left: 13px;\r\n    margin-right: -15px;\r\n}\r\n\r\n    .attr-nav > ul {\r\n        padding: 0;\r\n        margin: 0 0 -7px 0;\r\n        list-style: none;\r\n        display: inline-block;\r\n    }\r\n\r\n        .attr-nav > ul > li {\r\n            float: left;\r\n            display: block;\r\n        }\r\n\r\n            .attr-nav > ul > li > a {\r\n                color: #6f6f6f;\r\n                display: block;\r\n                padding: 28px 15px;\r\n                position: relative;\r\n            }\r\n\r\n                .attr-nav > ul > li > a span.badge {\r\n                    position: absolute;\r\n                    top: 50%;\r\n                    margin-top: -15px;\r\n                    right: 5px;\r\n                    font-size: 10px;\r\n                    padding: 0;\r\n                    width: 15px;\r\n                    height: 15px;\r\n                    padding-top: 2px;\r\n                }\r\n\r\n            .attr-nav > ul > li.dropdown ul.dropdown-menu {\r\n                -moz-border-radius: 0px;\r\n                -webkit-border-radius: 0px;\r\n                -o-border-radius: 0px;\r\n                border-radius: 0px;\r\n                -moz-box-shadow: 0px 0px 0px;\r\n                -webkit-box-shadow: 0px 0px 0px;\r\n                -o-box-shadow: 0px 0px 0px;\r\n                box-shadow: 0px 0px 0px;\r\n                border: solid 1px #f1f1f1;\r\n            }\r\n\r\nul.cart-list {\r\n    padding: 0 !important;\r\n    width: 250px !important;\r\n}\r\n\r\n    ul.cart-list > li {\r\n        position: relative;\r\n        border-bottom: solid 1px #efefef;\r\n        padding: 15px 15px 23px 15px !important;\r\n    }\r\n\r\n        ul.cart-list > li > a.photo {\r\n            padding: 0 !important;\r\n            margin-right: 15px;\r\n            float: left;\r\n            display: block;\r\n            width: 50px;\r\n            height: 50px;\r\n            left: 15px;\r\n            top: 15px;\r\n        }\r\n\r\n        ul.cart-list > li img {\r\n            width: 50px;\r\n            height: 50px;\r\n            border: solid 1px #efefef;\r\n        }\r\n\r\n        ul.cart-list > li > h6 {\r\n            margin: 0;\r\n        }\r\n\r\n            ul.cart-list > li > h6 > a.photo {\r\n                padding: 0 !important;\r\n                display: block;\r\n            }\r\n\r\n        ul.cart-list > li > p {\r\n            margin-bottom: 0;\r\n        }\r\n\r\n        ul.cart-list > li.total {\r\n            background-color: #f5f5f5;\r\n            padding-bottom: 15px !important;\r\n        }\r\n\r\n            ul.cart-list > li.total > .btn {\r\n                display: inline-block;\r\n                border-bottom: solid 1px #efefef;\r\n            }\r\n\r\n        ul.cart-list > li .price {\r\n            font-weight: bold;\r\n        }\r\n\r\n        ul.cart-list > li.total > span {\r\n            padding-top: 8px;\r\n        }\r\n\r\n/* Top Search\r\n=================================*/\r\n.top-search {\r\n    background-color: #333;\r\n    padding: 10px 0;\r\n    display: none;\r\n}\r\n\r\n    .top-search input.form-control {\r\n        background-color: transparent;\r\n        border: none;\r\n        -moz-box-shadow: 0px 0px 0px;\r\n        -webkit-box-shadow: 0px 0px 0px;\r\n        -o-box-shadow: 0px 0px 0px;\r\n        box-shadow: 0px 0px 0px;\r\n        color: #fff;\r\n        height: 40px;\r\n        padding: 0 15px;\r\n    }\r\n\r\n    .top-search .input-group-addon {\r\n        background-color: transparent;\r\n        border: none;\r\n        color: #fff;\r\n        padding-left: 0;\r\n        padding-right: 0;\r\n    }\r\n\r\n        .top-search .input-group-addon.close-search {\r\n            cursor: pointer;\r\n            position: relative;\r\n            z-index: 9;\r\n        }\r\n\r\n/* Side Menu\r\n=================================*/\r\nbody {\r\n    -webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    -ms-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n}\r\n\r\n    body.on-side {\r\n        margin-left: -280px;\r\n    }\r\n\r\n.side {\r\n    position: fixed;\r\n    overflow-y: auto;\r\n    top: 0;\r\n    right: -280px;\r\n    width: 280px;\r\n    padding: 25px 30px;\r\n    height: 100%;\r\n    display: block;\r\n    background-color: #333;\r\n    -webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    -ms-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n    z-index: 9;\r\n}\r\n\r\n    .side.on {\r\n        right: 0;\r\n    }\r\n\r\n    .side .close-side {\r\n        float: right;\r\n        color: #fff;\r\n        position: relative;\r\n        z-index: 2;\r\n        font-size: 16px;\r\n    }\r\n\r\n    .side .widget {\r\n        position: relative;\r\n        z-index: 1;\r\n        margin-bottom: 25px;\r\n    }\r\n\r\n        .side .widget .title {\r\n            color: #fff;\r\n            margin-bottom: 15px;\r\n        }\r\n\r\n        .side .widget ul.link {\r\n            padding: 0;\r\n            margin: 0;\r\n            list-style: none;\r\n        }\r\n\r\n            .side .widget ul.link li a {\r\n                color: #9f9f9f;\r\n                letter-spacing: 1px;\r\n                display: block;\r\n                padding: 5px 10px;\r\n                color: #f4f4f4;\r\n                font-weight: 400;\r\n            }\r\n\r\n                .side .widget ul.link li a:hover {\r\n                    background: #f4f4f4;\r\n                }\r\n\r\n                .side .widget ul.link li a:focus,\r\n                .side .widget ul.link li a:hover {\r\n                    color: #fff;\r\n                    text-decoration: none;\r\n                }\r\n\r\n/* Share\r\n=================================*/\r\nnav.navbar.bootsnav .share {\r\n    padding: 0 30px;\r\n    margin-bottom: 30px;\r\n}\r\n\r\n    nav.navbar.bootsnav .share ul {\r\n        display: inline-block;\r\n        padding: 0;\r\n        margin: 0 0 -7px 0;\r\n        list-style: none;\r\n    }\r\n\r\n        nav.navbar.bootsnav .share ul > li {\r\n            float: left;\r\n            display: block;\r\n            margin-right: 5px;\r\n        }\r\n\r\n            nav.navbar.bootsnav .share ul > li > a {\r\n                display: table-cell;\r\n                vertical-align: middle;\r\n                text-align: center;\r\n                width: 35px;\r\n                height: 35px;\r\n                -moz-border-radius: 50%;\r\n                -webkit-border-radius: 50%;\r\n                -o-border-radius: 50%;\r\n                border-radius: 50%;\r\n                background-color: #cfcfcf;\r\n                color: #fff;\r\n            }\r\n\r\n/* Transparent\r\n=================================*/\r\nnav.navbar.bootsnav.navbar-fixed {\r\n    position: fixed;\r\n    display: block;\r\n    width: 100%;\r\n    z-index: 999;\r\n}\r\n\r\nnav.navbar.bootsnav.no-background {\r\n    -webkit-transition: all 4s ease-in-out;\r\n    -moz-transition: all 4s ease-in-out;\r\n    -o-transition: all 4s ease-in-out;\r\n    -ms-transition: all 4s ease-in-out;\r\n    transition: all 4s ease-in-out;\r\n}\r\n\r\n/* Navbar Sticky\r\n=================================*/\r\n.wrap-sticky {\r\n    position: relative;\r\n    -webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    -ms-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n}\r\n\r\n    .wrap-sticky nav.navbar.bootsnav {\r\n        position: absolute;\r\n        width: 100%;\r\n        left: 0;\r\n        top: 0;\r\n    }\r\n\r\n        .wrap-sticky nav.navbar.bootsnav.sticked {\r\n            position: fixed;\r\n            -webkit-transition: all 0.4s ease-in-out;\r\n            -moz-transition: all 0.4s ease-in-out;\r\n            -o-transition: all 0.4s ease-in-out;\r\n            -ms-transition: all 0.4s ease-in-out;\r\n            transition: all 0.4s ease-in-out;\r\n        }\r\n\r\nbody.on-side .wrap-sticky nav.navbar.bootsnav.sticked {\r\n    left: -280px;\r\n}\r\n\r\n/* Navbar Responsive\r\n=================================*/\r\n@media (min-width: 1024px) and (max-width:1400px) {\r\n    body.wrap-nav-sidebar .wrapper .container {\r\n        width: 100%;\r\n        padding-left: 30px;\r\n        padding-right: 30px;\r\n    }\r\n}\r\n\r\n@media (min-width: 1024px) {\r\n    /* General Navbar\r\n    =================================*/\r\n    nav.navbar.bootsnav ul.nav .dropdown-menu .dropdown-menu {\r\n        margin-top: -2px;\r\n    }\r\n\r\n    nav.navbar.bootsnav ul.nav.navbar-right .dropdown-menu .dropdown-menu {\r\n        left: -200px;\r\n    }\r\n\r\n    nav.navbar.bootsnav ul.nav > li > a {\r\n        padding: 38px 10px;\r\n        font-weight: 400;\r\n    }\r\n\r\n    nav.navbar.bootsnav ul.nav > li.dropdown > a.dropdown-toggle:after {\r\n        font-family: 'FontAwesome';\r\n        content: \"\\F0D7\";\r\n        margin-left: 5px;\r\n        margin-top: 2px;\r\n    }\r\n\r\n    nav.navbar.bootsnav li.dropdown ul.dropdown-menu {\r\n        -moz-box-shadow: 0px 0px 0px;\r\n        -webkit-box-shadow: 0px 0px 0px;\r\n        -o-box-shadow: 0px 0px 0px;\r\n        box-shadow: 0px 0px 0px;\r\n        -moz-border-radius: 0px;\r\n        -webkit-border-radius: 0px;\r\n        -o-border-radius: 0px;\r\n        border-radius: 0px;\r\n        padding: 0;\r\n        width: 200px;\r\n        background: #fff;\r\n        border: solid 1px #f1f1f1;\r\n        border-top: solid 5px;\r\n    }\r\n\r\n        nav.navbar.bootsnav li.dropdown ul.dropdown-menu > li a:hover,\r\n        nav.navbar.bootsnav li.dropdown ul.dropdown-menu > li a:hover {\r\n            background-color: transparent;\r\n        }\r\n\r\n        nav.navbar.bootsnav li.dropdown ul.dropdown-menu > li > a {\r\n            padding: 10px 15px;\r\n            border-bottom: solid 1px #eee;\r\n            color: #6f6f6f;\r\n        }\r\n\r\n        nav.navbar.bootsnav li.dropdown ul.dropdown-menu > li:last-child > a {\r\n            border-bottom: none;\r\n        }\r\n\r\n        /*    nav.navbar.bootsnav ul.navbar-right li.dropdown ul.dropdown-menu li a{\r\n        text-align: right;\r\n    }\r\n  */\r\n        /*\r\n    nav.navbar.bootsnav li.dropdown ul.dropdown-menu li.dropdown > a.dropdown-toggle:before{\r\n        font-family: 'FontAwesome';\r\n        float: right;\r\n        content: \"\\f105\";\r\n        margin-top: 0;\r\n    }\r\n    \r\n    nav.navbar.bootsnav ul.navbar-right li.dropdown ul.dropdown-menu li.dropdown > a.dropdown-toggle:before{\r\n        font-family: 'FontAwesome';\r\n        float: left;\r\n        content: \"\\f104\";\r\n        margin-top: 0;\r\n    }\r\n*/\r\n\r\n        nav.navbar.bootsnav li.dropdown ul.dropdown-menu ul.dropdown-menu {\r\n            top: -3px;\r\n        }\r\n\r\n    nav.navbar.bootsnav ul.dropdown-menu.megamenu-content {\r\n        padding: 0 15px !important;\r\n    }\r\n\r\n        nav.navbar.bootsnav ul.dropdown-menu.megamenu-content > li {\r\n            padding: 25px 0 20px;\r\n        }\r\n\r\n        nav.navbar.bootsnav ul.dropdown-menu.megamenu-content.tabbed {\r\n            padding: 0;\r\n        }\r\n\r\n            nav.navbar.bootsnav ul.dropdown-menu.megamenu-content.tabbed > li {\r\n                padding: 0;\r\n            }\r\n\r\n        nav.navbar.bootsnav ul.dropdown-menu.megamenu-content .col-menu {\r\n            padding: 0 30px;\r\n            margin: 0 -0.5px;\r\n            border-left: solid 1px #f0f0f0;\r\n            border-right: solid 1px #f0f0f0;\r\n        }\r\n\r\n            nav.navbar.bootsnav ul.dropdown-menu.megamenu-content .col-menu:first-child {\r\n                border-left: none;\r\n            }\r\n\r\n            nav.navbar.bootsnav ul.dropdown-menu.megamenu-content .col-menu:last-child {\r\n                border-right: none;\r\n            }\r\n\r\n        nav.navbar.bootsnav ul.dropdown-menu.megamenu-content .content {\r\n            display: none;\r\n        }\r\n\r\n            nav.navbar.bootsnav ul.dropdown-menu.megamenu-content .content ul.menu-col li a {\r\n                text-align: left;\r\n                padding: 5px 0;\r\n                display: block;\r\n                width: 100%;\r\n                margin-bottom: 0;\r\n                border-bottom: none;\r\n                color: #6f6f6f;\r\n            }\r\n\r\n    nav.navbar.bootsnav.on ul.dropdown-menu.megamenu-content .content {\r\n        display: block !important;\r\n        height: auto !important;\r\n    }\r\n\r\n    /* Navbar Transparent\r\n    =================================*/\r\n    nav.navbar.bootsnav.no-background {\r\n        background-color: transparent;\r\n        border: none;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-transparent .attr-nav {\r\n        padding-left: 15px;\r\n        margin-left: 30px;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-transparent.white {\r\n        background-color: rgba(255,255,255,0.3);\r\n        border-bottom: solid 1px #bbb;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse.bootsnav.navbar-transparent.dark,\r\n    nav.navbar.bootsnav.navbar-transparent.dark {\r\n        background-color: rgba(0,0,0,0.3);\r\n        border-bottom: solid 1px #555;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-transparent.white .attr-nav {\r\n        border-left: solid 1px #bbb;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse.bootsnav.navbar-transparent.dark .attr-nav,\r\n    nav.navbar.bootsnav.navbar-transparent.dark .attr-nav {\r\n        border-left: solid 1px #555;\r\n    }\r\n\r\n    nav.navbar.bootsnav.no-background.white .attr-nav > ul > li > a,\r\n    nav.navbar.bootsnav.navbar-transparent.white .attr-nav > ul > li > a,\r\n    nav.navbar.bootsnav.navbar-transparent.white ul.nav > li > a,\r\n    nav.navbar.bootsnav.no-background.white ul.nav > li > a {\r\n        color: #fff;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-transparent.dark .attr-nav > ul > li > a,\r\n    nav.navbar.bootsnav.navbar-transparent.dark ul.nav > li > a {\r\n        color: #eee;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-fixed.navbar-transparent .logo-scrolled,\r\n    nav.navbar.bootsnav.navbar-fixed.no-background .logo-scrolled {\r\n        display: none;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-fixed.navbar-transparent .logo-display,\r\n    nav.navbar.bootsnav.navbar-fixed.no-background .logo-display {\r\n        display: block;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-fixed .logo-display {\r\n        display: none;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-fixed .logo-scrolled {\r\n        display: block;\r\n    }\r\n\r\n    /* Atribute Navigation\r\n    =================================*/\r\n    .attr-nav > ul > li.dropdown ul.dropdown-menu {\r\n        margin-top: 0;\r\n        margin-left: 55px;\r\n        width: 250px;\r\n        left: -250px;\r\n    }\r\n\r\n    /* Menu Center\r\n    =================================*/\r\n    nav.navbar.bootsnav.menu-center .container {\r\n        position: relative;\r\n    }\r\n\r\n    nav.navbar.bootsnav.menu-center ul.nav.navbar-center {\r\n        float: none;\r\n        margin: 0 auto;\r\n        display: table;\r\n        table-layout: fixed;\r\n    }\r\n\r\n    nav.navbar.bootsnav.menu-center .navbar-header,\r\n    nav.navbar.bootsnav.menu-center .attr-nav {\r\n        position: absolute;\r\n    }\r\n\r\n    nav.navbar.bootsnav.menu-center .attr-nav {\r\n        right: 15px;\r\n    }\r\n\r\n    /* Navbar Brand top\r\n    =================================*/\r\n    nav.bootsnav.navbar-brand-top .navbar-header {\r\n        display: block;\r\n        width: 100%;\r\n        text-align: center;\r\n    }\r\n\r\n    nav.bootsnav.navbar-brand-top ul.nav > li.dropdown > ul.dropdown-menu {\r\n        margin-top: 2px;\r\n    }\r\n\r\n    nav.bootsnav.navbar-brand-top ul.nav > li.dropdown.megamenu-fw > ul.dropdown-menu {\r\n        margin-top: 0;\r\n    }\r\n\r\n    nav.bootsnav.navbar-brand-top .navbar-header .navbar-brand {\r\n        display: inline-block;\r\n        float: none;\r\n        margin: 0;\r\n    }\r\n\r\n    nav.bootsnav.navbar-brand-top .navbar-collapse {\r\n        text-align: center;\r\n    }\r\n\r\n    nav.bootsnav.navbar-brand-top ul.nav {\r\n        display: inline-block;\r\n        float: none;\r\n        margin: 0 0 -5px 0;\r\n    }\r\n\r\n    /* Navbar Center\r\n    =================================*/\r\n    nav.bootsnav.brand-center .navbar-header {\r\n        display: block;\r\n        width: 100%;\r\n        position: absolute;\r\n        text-align: center;\r\n        top: 0;\r\n        left: 0;\r\n    }\r\n\r\n    nav.bootsnav.brand-center .navbar-brand {\r\n        display: inline-block;\r\n        float: none;\r\n    }\r\n\r\n    nav.bootsnav.brand-center .navbar-collapse {\r\n        text-align: center;\r\n        display: inline-block;\r\n        padding-left: 0;\r\n        padding-right: 0;\r\n    }\r\n\r\n    nav.bootsnav.brand-center ul.nav > li.dropdown > ul.dropdown-menu {\r\n        margin-top: 2px;\r\n    }\r\n\r\n    nav.bootsnav.brand-center ul.nav > li.dropdown.megamenu-fw > ul.dropdown-menu {\r\n        margin-top: 0;\r\n    }\r\n\r\n    nav.bootsnav.brand-center .navbar-collapse .col-half {\r\n        width: 50%;\r\n        float: left;\r\n        display: block;\r\n    }\r\n\r\n        nav.bootsnav.brand-center .navbar-collapse .col-half.left {\r\n            text-align: right;\r\n            padding-right: 100px;\r\n        }\r\n\r\n        nav.bootsnav.brand-center .navbar-collapse .col-half.right {\r\n            text-align: left;\r\n            padding-left: 100px;\r\n        }\r\n\r\n    nav.bootsnav.brand-center ul.nav {\r\n        float: none !important;\r\n        margin-bottom: -5px !important;\r\n        display: inline-block !important;\r\n    }\r\n\r\n        nav.bootsnav.brand-center ul.nav.navbar-right {\r\n            margin: 0;\r\n        }\r\n\r\n    nav.bootsnav.brand-center.center-side .navbar-collapse .col-half.left {\r\n        text-align: left;\r\n        padding-right: 100px;\r\n    }\r\n\r\n    nav.bootsnav.brand-center.center-side .navbar-collapse .col-half.right {\r\n        text-align: right;\r\n        padding-left: 100px;\r\n    }\r\n\r\n    /* Navbar Sidebar\r\n    =================================*/\r\n    body.wrap-nav-sidebar .wrapper {\r\n        padding-left: 260px;\r\n        overflow-x: hidden;\r\n    }\r\n\r\n    nav.bootsnav.navbar-sidebar {\r\n        position: fixed;\r\n        width: 260px;\r\n        overflow: hidden;\r\n        left: 0;\r\n        padding: 0 0 0 0 !important;\r\n        background: #fff;\r\n        border-right: solid 1px #dfdfdf;\r\n    }\r\n\r\n        nav.bootsnav.navbar-sidebar .scroller {\r\n            width: 280px;\r\n            overflow-y: auto;\r\n            overflow-x: hidden;\r\n        }\r\n\r\n        nav.bootsnav.navbar-sidebar .container-fluid,\r\n        nav.bootsnav.navbar-sidebar .container {\r\n            padding: 0 !important;\r\n        }\r\n\r\n        nav.bootsnav.navbar-sidebar .navbar-header {\r\n            float: none;\r\n            display: block;\r\n            width: 260px;\r\n            padding: 10px 15px;\r\n            margin: 10px 0 0 0 !important;\r\n        }\r\n\r\n        nav.bootsnav.navbar-sidebar .navbar-collapse {\r\n            padding: 0 !important;\r\n            width: 260px;\r\n        }\r\n\r\n        nav.bootsnav.navbar-sidebar ul.nav {\r\n            float: none;\r\n            display: block;\r\n            width: 100%;\r\n            padding: 0 15px !important;\r\n            margin: 0 0 30px 0;\r\n        }\r\n\r\n            nav.bootsnav.navbar-sidebar ul.nav li {\r\n                float: none !important;\r\n            }\r\n\r\n            nav.bootsnav.navbar-sidebar ul.nav > li > a {\r\n                padding: 10px 15px;\r\n                font-weight: bold;\r\n            }\r\n\r\n            nav.bootsnav.navbar-sidebar ul.nav > li.dropdown > a:after {\r\n                float: right;\r\n            }\r\n\r\n            nav.bootsnav.navbar-sidebar ul.nav li.dropdown ul.dropdown-menu {\r\n                left: 100%;\r\n                top: 0;\r\n                position: relative !important;\r\n                left: 0 !important;\r\n                width: 100% !important;\r\n                height: auto !important;\r\n                background-color: transparent;\r\n                border: none !important;\r\n                padding: 0;\r\n                -moz-box-shadow: 0px 0px 0px;\r\n                -webkit-box-shadow: 0px 0px 0px;\r\n                -o-box-shadow: 0px 0px 0px;\r\n                box-shadow: 0px 0px 0px;\r\n            }\r\n\r\n            nav.bootsnav.navbar-sidebar ul.nav .megamenu-content .col-menu {\r\n                border: none !important;\r\n            }\r\n\r\n            nav.bootsnav.navbar-sidebar ul.nav > li.dropdown > ul.dropdown-menu {\r\n                margin-bottom: 15px;\r\n            }\r\n\r\n            nav.bootsnav.navbar-sidebar ul.nav li.dropdown ul.dropdown-menu {\r\n                padding-left: 0;\r\n                float: none;\r\n                margin-bottom: 0;\r\n            }\r\n\r\n                nav.bootsnav.navbar-sidebar ul.nav li.dropdown ul.dropdown-menu li a {\r\n                    padding: 5px 15px;\r\n                    color: #6f6f6f;\r\n                    border: none;\r\n                }\r\n\r\n                nav.bootsnav.navbar-sidebar ul.nav li.dropdown ul.dropdown-menu ul.dropdown-menu {\r\n                    padding-left: 15px;\r\n                    margin-top: 0;\r\n                }\r\n\r\n                nav.bootsnav.navbar-sidebar ul.nav li.dropdown ul.dropdown-menu li.dropdown > a:before {\r\n                    font-family: 'FontAwesome';\r\n                    content: \"\\F105\";\r\n                    float: right;\r\n                }\r\n\r\n            nav.bootsnav.navbar-sidebar ul.nav li.dropdown.on ul.dropdown-menu li.dropdown.on > a:before {\r\n                content: \"\\F107\";\r\n            }\r\n\r\n        nav.bootsnav.navbar-sidebar ul.dropdown-menu.megamenu-content > li {\r\n            padding: 0 !important;\r\n        }\r\n\r\n        nav.bootsnav.navbar-sidebar .dropdown .megamenu-content .col-menu {\r\n            display: block;\r\n            float: none !important;\r\n            padding: 0;\r\n            margin: 0;\r\n            width: 100%;\r\n        }\r\n\r\n            nav.bootsnav.navbar-sidebar .dropdown .megamenu-content .col-menu .title {\r\n                padding: 7px 0;\r\n                text-transform: none;\r\n                font-weight: 400;\r\n                letter-spacing: 0px;\r\n                margin-bottom: 0;\r\n                cursor: pointer;\r\n                color: #6f6f6f;\r\n            }\r\n\r\n                nav.bootsnav.navbar-sidebar .dropdown .megamenu-content .col-menu .title:before {\r\n                    font-family: 'FontAwesome';\r\n                    content: \"\\F105\";\r\n                    float: right;\r\n                }\r\n\r\n            nav.bootsnav.navbar-sidebar .dropdown .megamenu-content .col-menu.on .title:before {\r\n                content: \"\\F107\";\r\n            }\r\n\r\n        nav.bootsnav.navbar-sidebar .dropdown .megamenu-content .col-menu {\r\n            border: none;\r\n        }\r\n\r\n            nav.bootsnav.navbar-sidebar .dropdown .megamenu-content .col-menu .content {\r\n                padding: 0 0 0 15px;\r\n            }\r\n\r\n            nav.bootsnav.navbar-sidebar .dropdown .megamenu-content .col-menu ul.menu-col li a {\r\n                padding: 3px 0 !important;\r\n            }\r\n}\r\n\r\n@media (max-width: 992px) {\r\n    /* Navbar Responsive\r\n    =================================*/\r\n    nav.navbar.bootsnav .navbar-brand {\r\n        display: inline-block;\r\n        float: none !important;\r\n        margin: 0 !important;\r\n    }\r\n\r\n    nav.navbar.bootsnav .navbar-header {\r\n        float: none;\r\n        display: block;\r\n        text-align: center;\r\n        padding-left: 30px;\r\n        padding-right: 30px;\r\n    }\r\n\r\n    nav.navbar.bootsnav .navbar-toggle {\r\n        display: inline-block;\r\n        float: left;\r\n        margin-right: -200px;\r\n        margin-top: 10px;\r\n    }\r\n\r\n    nav.navbar.bootsnav .navbar-collapse {\r\n        border: none;\r\n        margin-bottom: 0;\r\n    }\r\n\r\n    nav.navbar.bootsnav.no-full .navbar-collapse {\r\n        max-height: 350px;\r\n        overflow-y: auto !important;\r\n    }\r\n\r\n    nav.navbar.bootsnav .navbar-collapse.collapse {\r\n        display: none !important;\r\n    }\r\n\r\n        nav.navbar.bootsnav .navbar-collapse.collapse.in {\r\n            display: block !important;\r\n        }\r\n\r\n    nav.navbar.bootsnav .navbar-nav {\r\n        float: none !important;\r\n        padding-left: 30px;\r\n        padding-right: 30px;\r\n        margin: 0px -15px;\r\n    }\r\n\r\n        nav.navbar.bootsnav .navbar-nav > li {\r\n            float: none;\r\n        }\r\n\r\n    nav.navbar.bootsnav li.dropdown a.dropdown-toggle:before {\r\n        font-family: 'FontAwesome';\r\n        content: \"\\F105\";\r\n        float: right;\r\n        font-size: 16px;\r\n        margin-left: 10px;\r\n    }\r\n\r\n    nav.navbar.bootsnav li.dropdown.on > a.dropdown-toggle:before {\r\n        content: \"\\F107\";\r\n    }\r\n\r\n    nav.navbar.bootsnav .navbar-nav > li > a {\r\n        display: block;\r\n        width: 100%;\r\n        border-bottom: solid 1px #f1f1f1;\r\n        padding: 10px 0;\r\n        border-top: solid 1px #f1f1f1;\r\n        margin-bottom: -1px;\r\n        padding-left: 15px;\r\n        padding-right: 15px;\r\n    }\r\n\r\n        nav.navbar.bootsnav .navbar-nav > li > a:hover {\r\n            background: #f1f1f1;\r\n        }\r\n\r\n    nav.navbar.bootsnav .navbar-nav > li:first-child > a {\r\n        border-top: none;\r\n    }\r\n\r\n    nav.navbar.bootsnav ul.navbar-nav.navbar-left > li:last-child > ul.dropdown-menu {\r\n        border-bottom: solid 1px #f1f1f1;\r\n    }\r\n\r\n    nav.navbar.bootsnav ul.nav li.dropdown li a.dropdown-toggle {\r\n        float: none !important;\r\n        position: relative;\r\n        display: block;\r\n        width: 100%;\r\n    }\r\n\r\n    nav.navbar.bootsnav ul.nav li.dropdown ul.dropdown-menu {\r\n        width: 100%;\r\n        position: relative !important;\r\n        background-color: transparent;\r\n        float: none;\r\n        border: none;\r\n        padding: 0 0 0 15px !important;\r\n        margin: 0 0 -1px 0 !important;\r\n        -moz-box-shadow: 0px 0px 0px;\r\n        -webkit-box-shadow: 0px 0px 0px;\r\n        -o-box-shadow: 0px 0px 0px;\r\n        box-shadow: 0px 0px 0px;\r\n        -moz-border-radius: 0px 0px 0px;\r\n        -webkit-border-radius: 0px 0px 0px;\r\n        -o-border-radius: 0px 0px 0px;\r\n        border-radius: 0px 0px 0px;\r\n    }\r\n\r\n        nav.navbar.bootsnav ul.nav li.dropdown ul.dropdown-menu > li > a {\r\n            display: block;\r\n            width: 100%;\r\n            border-bottom: solid 1px #f1f1f1;\r\n            padding: 10px 0;\r\n            color: #6f6f6f;\r\n        }\r\n\r\n    nav.navbar.bootsnav ul.nav ul.dropdown-menu li a:hover,\r\n    nav.navbar.bootsnav ul.nav ul.dropdown-menu li a:focus {\r\n        background-color: transparent;\r\n    }\r\n\r\n    nav.navbar.bootsnav ul.nav ul.dropdown-menu ul.dropdown-menu {\r\n        float: none !important;\r\n        left: 0;\r\n        padding: 0 0 0 15px;\r\n        position: relative;\r\n        background: transparent;\r\n        width: 100%;\r\n    }\r\n\r\n    nav.navbar.bootsnav ul.nav ul.dropdown-menu li.dropdown.on > ul.dropdown-menu {\r\n        display: inline-block;\r\n        margin-top: -10px;\r\n    }\r\n\r\n    nav.navbar.bootsnav li.dropdown ul.dropdown-menu li.dropdown > a.dropdown-toggle:after {\r\n        display: none;\r\n    }\r\n\r\n    nav.navbar.bootsnav .dropdown .megamenu-content .col-menu .title {\r\n        padding: 10px 15px 10px 0;\r\n        line-height: 24px;\r\n        text-transform: none;\r\n        font-weight: 400;\r\n        letter-spacing: 0px;\r\n        margin-bottom: 0;\r\n        cursor: pointer;\r\n        border-bottom: solid 1px #f1f1f1;\r\n        color: #6f6f6f;\r\n    }\r\n\r\n    nav.navbar.bootsnav .dropdown .megamenu-content .col-menu ul > li > a {\r\n        display: block;\r\n        width: 100%;\r\n        border-bottom: solid 1px #f1f1f1;\r\n        padding: 8px 0;\r\n    }\r\n\r\n    nav.navbar.bootsnav .dropdown .megamenu-content .col-menu .title:before {\r\n        font-family: 'FontAwesome';\r\n        content: \"\\F105\";\r\n        float: right;\r\n        font-size: 16px;\r\n        margin-left: 10px;\r\n        position: relative;\r\n        right: -15px;\r\n    }\r\n\r\n    nav.navbar.bootsnav .dropdown .megamenu-content .col-menu:last-child .title {\r\n        border-bottom: none;\r\n    }\r\n\r\n    nav.navbar.bootsnav .dropdown .megamenu-content .col-menu.on:last-child .title {\r\n        border-bottom: solid 1px #f1f1f1;\r\n    }\r\n\r\n    nav.navbar.bootsnav .dropdown .megamenu-content .col-menu:last-child ul.menu-col li:last-child a {\r\n        border-bottom: none;\r\n    }\r\n\r\n    nav.navbar.bootsnav .dropdown .megamenu-content .col-menu.on .title:before {\r\n        content: \"\\F107\";\r\n    }\r\n\r\n    nav.navbar.bootsnav .dropdown .megamenu-content .col-menu .content {\r\n        padding: 0 0 0 15px;\r\n    }\r\n\r\n    nav.bootsnav.brand-center .navbar-collapse {\r\n        display: block;\r\n    }\r\n\r\n    nav.bootsnav.brand-center ul.nav {\r\n        margin-bottom: 0px !important;\r\n    }\r\n\r\n    nav.bootsnav.brand-center .navbar-collapse .col-half {\r\n        width: 100%;\r\n        float: none;\r\n        display: block;\r\n    }\r\n\r\n        nav.bootsnav.brand-center .navbar-collapse .col-half.left {\r\n            margin-bottom: 0;\r\n        }\r\n\r\n    nav.bootsnav .megamenu-content {\r\n        padding: 0;\r\n    }\r\n\r\n        nav.bootsnav .megamenu-content .col-menu {\r\n            padding-bottom: 0;\r\n        }\r\n\r\n        nav.bootsnav .megamenu-content .title {\r\n            cursor: pointer;\r\n            display: block;\r\n            padding: 10px 15px;\r\n            margin-bottom: 0;\r\n            font-weight: normal;\r\n        }\r\n\r\n        nav.bootsnav .megamenu-content .content {\r\n            display: none;\r\n        }\r\n\r\n    .attr-nav {\r\n        position: absolute;\r\n        right: 60px;\r\n    }\r\n\r\n        .attr-nav > ul {\r\n            padding: 0;\r\n            margin: 0 -15px -7px 0;\r\n        }\r\n\r\n            .attr-nav > ul > li > a {\r\n                padding: 16px 15px 15px;\r\n            }\r\n\r\n            .attr-nav > ul > li.dropdown > a.dropdown-toggle:before {\r\n                display: none;\r\n            }\r\n\r\n            .attr-nav > ul > li.dropdown ul.dropdown-menu {\r\n                margin-top: 2px;\r\n                margin-left: 55px;\r\n                width: 250px;\r\n                left: -250px;\r\n                border-top: solid 5px;\r\n            }\r\n\r\n    .top-search .container {\r\n        padding: 0 45px;\r\n    }\r\n\r\n    /* Navbar full Responsive\r\n    =================================*/\r\n    nav.bootsnav.navbar-full ul.nav {\r\n        margin-left: 0;\r\n    }\r\n\r\n        nav.bootsnav.navbar-full ul.nav > li > a {\r\n            border: none;\r\n        }\r\n\r\n    nav.bootsnav.navbar-full .navbar-brand {\r\n        float: left !important;\r\n        padding-left: 0;\r\n    }\r\n\r\n    nav.bootsnav.navbar-full .navbar-toggle {\r\n        display: inline-block;\r\n        float: right;\r\n        margin-right: 0;\r\n        margin-top: 10px;\r\n    }\r\n\r\n    nav.bootsnav.navbar-full .navbar-header {\r\n        padding-left: 15px;\r\n        padding-right: 15px;\r\n    }\r\n\r\n    /* Navbar Sidebar\r\n    =================================*/\r\n    nav.navbar.bootsnav.navbar-sidebar .share {\r\n        padding: 30px 15px;\r\n        margin-bottom: 0;\r\n    }\r\n\r\n    /* Tabs\r\n    =================================*/\r\n    nav.navbar.bootsnav .megamenu-content.tabbed {\r\n        padding-left: 0 !mportant;\r\n    }\r\n\r\n    nav.navbar.bootsnav .tabbed > li {\r\n        padding: 25px 0;\r\n        margin-left: -15px !important;\r\n    }\r\n\r\n    /* Mobile Navigation\r\n    =================================*/\r\n    body > .wrapper {\r\n        -webkit-transition: all 0.4s ease-in-out;\r\n        -moz-transition: all 0.4s ease-in-out;\r\n        -o-transition: all 0.4s ease-in-out;\r\n        -ms-transition: all 0.4s ease-in-out;\r\n        transition: all 0.4s ease-in-out;\r\n    }\r\n\r\n    body.side-right > .wrapper {\r\n        margin-left: 280px;\r\n        margin-right: -280px !important;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-mobile .navbar-collapse {\r\n        position: fixed;\r\n        overflow-y: auto !important;\r\n        overflow-x: hidden !important;\r\n        display: block;\r\n        background: #fff;\r\n        z-index: 99;\r\n        width: 280px;\r\n        height: 100% !important;\r\n        left: -280px;\r\n        top: 0;\r\n        padding: 0;\r\n        -webkit-transition: all 0.4s ease-in-out;\r\n        -moz-transition: all 0.4s ease-in-out;\r\n        -o-transition: all 0.4s ease-in-out;\r\n        -ms-transition: all 0.4s ease-in-out;\r\n        transition: all 0.4s ease-in-out;\r\n    }\r\n\r\n        nav.navbar.bootsnav.navbar-mobile .navbar-collapse.in {\r\n            left: 0;\r\n        }\r\n\r\n    nav.navbar.bootsnav.navbar-mobile ul.nav {\r\n        width: 293px;\r\n        padding-right: 0;\r\n        padding-left: 15px;\r\n    }\r\n\r\n        nav.navbar.bootsnav.navbar-mobile ul.nav > li > a {\r\n            padding: 15px 15px;\r\n        }\r\n\r\n        nav.navbar.bootsnav.navbar-mobile ul.nav ul.dropdown-menu > li > a {\r\n            padding-right: 15px !important;\r\n            padding-top: 15px !important;\r\n            padding-bottom: 15px !important;\r\n        }\r\n\r\n        nav.navbar.bootsnav.navbar-mobile ul.nav ul.dropdown-menu .col-menu .title {\r\n            padding-right: 30px !important;\r\n            padding-top: 13px !important;\r\n            padding-bottom: 13px !important;\r\n        }\r\n\r\n        nav.navbar.bootsnav.navbar-mobile ul.nav ul.dropdown-menu .col-menu ul.menu-col li a {\r\n            padding-top: 13px !important;\r\n            padding-bottom: 13px !important;\r\n        }\r\n\r\n    nav.navbar.bootsnav.navbar-mobile .navbar-collapse [class*=' col-'] {\r\n        width: 100%;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-fixed .logo-scrolled {\r\n        display: block !important;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-fixed .logo-display {\r\n        display: none !important;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-mobile .tab-menu,\r\n    nav.navbar.bootsnav.navbar-mobile .tab-content {\r\n        width: 100%;\r\n        display: block;\r\n    }\r\n}\r\n\r\n@media (max-width: 767px) {\r\n    nav.navbar.bootsnav .navbar-header {\r\n        padding-left: 15px;\r\n        padding-right: 15px;\r\n    }\r\n\r\n    nav.navbar.bootsnav .navbar-nav {\r\n        padding-left: 15px;\r\n        padding-right: 15px;\r\n    }\r\n\r\n    .attr-nav {\r\n        right: 30px;\r\n    }\r\n\r\n        .attr-nav > ul {\r\n            margin-right: -10px;\r\n        }\r\n\r\n            .attr-nav > ul > li > a {\r\n                padding: 16px 10px 15px;\r\n                padding-left: 0 !important;\r\n            }\r\n\r\n            .attr-nav > ul > li.dropdown ul.dropdown-menu {\r\n                left: -275px;\r\n            }\r\n\r\n    .top-search .container {\r\n        padding: 0 15px;\r\n    }\r\n\r\n    nav.bootsnav.navbar-full .navbar-collapse {\r\n        left: 15px;\r\n    }\r\n\r\n    nav.bootsnav.navbar-full .navbar-header {\r\n        padding-right: 0;\r\n    }\r\n\r\n    nav.bootsnav.navbar-full .navbar-toggle {\r\n        margin-right: -15px;\r\n    }\r\n\r\n    nav.bootsnav.navbar-full ul.nav > li > a {\r\n        font-size: 18px !important;\r\n        line-height: 24px !important;\r\n        padding: 5px 10px !important;\r\n    }\r\n\r\n    /* Navbar Sidebar\r\n    =================================*/\r\n    nav.navbar.bootsnav.navbar-sidebar .share {\r\n        padding: 30px 15px !important;\r\n    }\r\n\r\n    /* Navbar Sidebar\r\n    =================================*/\r\n    nav.navbar.bootsnav.navbar-sidebar .share {\r\n        padding: 30px 0 !important;\r\n        margin-bottom: 0;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-mobile.navbar-sidebar .share {\r\n        padding: 30px 15px !important;\r\n        margin-bottom: 0;\r\n    }\r\n\r\n    /* Mobile Navigation\r\n    =================================*/\r\n    body.side-right > .wrapper {\r\n        margin-left: 280px;\r\n        margin-right: -280px !important;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-mobile .navbar-collapse {\r\n        margin-left: 0;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-mobile ul.nav {\r\n        margin-left: -15px;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-mobile ul.nav {\r\n        border-top: solid 1px #fff;\r\n    }\r\n\r\n    li.close-full-menu {\r\n        padding-top: 15px !important;\r\n        padding-bottom: 15px !important;\r\n    }\r\n}\r\n\r\n@media (min-width: 480px) and (max-width: 640px) {\r\n    nav.bootsnav.navbar-full ul.nav {\r\n        padding-top: 30px;\r\n        padding-bottom: 30px;\r\n    }\r\n}\r\n\r\n\r\n\r\n/*\r\nNavbar Adjusment\r\n=========================== */\r\n/* Navbar Atribute ------*/\r\n\r\n.attr-nav > ul > li > a {\r\n    padding: 34px 15px;\r\n}\r\n\r\n.top-search input.form-control {\r\n    margin-bottom: 0px;\r\n}\r\n\r\nul.cart-list > li.total > .btn {\r\n    border-bottom: solid 1px #cfcfcf !important;\r\n    color: #fff !important;\r\n    padding: 10px 15px;\r\n}\r\n\r\n@media (min-width: 1024px) {\r\n    /* Navbar General ------*/\r\n\r\n    nav.navbar ul.nav > li > a {\r\n        font-weight: 600;\r\n    }\r\n\r\n    nav.navbar .navbar-brand {\r\n        margin-top: 0;\r\n    }\r\n\r\n    nav.navbar .navbar-brand {\r\n        margin-top: 0;\r\n    }\r\n\r\n    nav.navbar li.dropdown ul.dropdown-menu {\r\n        border-top: solid 5px;\r\n    }\r\n    /* Navbar Center ------*/\r\n\r\n    nav.navbar-center .navbar-brand {\r\n        margin: 0 !important;\r\n    }\r\n    /* Navbar Brand Top ------*/\r\n\r\n    nav.navbar-brand-top .navbar-brand {\r\n        padding: 10px !important;\r\n        padding-bottom: 0px !important;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-brand-top ul.nav > li > a {\r\n        padding: 10px 15px\r\n    }\r\n    /* Navbar Full ------*/\r\n\r\n    nav.navbar-full .navbar-brand {\r\n        position: relative;\r\n    }\r\n    /* Navbar Sidebar ------*/\r\n\r\n    nav.navbar-sidebar ul.nav,\r\n    nav.navbar-sidebar .navbar-brand {\r\n        margin-bottom: 50px;\r\n    }\r\n\r\n        nav.navbar-sidebar ul.nav > li > a {\r\n            padding: 10px 15px;\r\n            font-weight: bold;\r\n        }\r\n    /* Navbar Transparent & Fixed ------*/\r\n\r\n    nav.navbar.bootsnav.navbar-transparent.white {\r\n        background-color: rgba(255, 255, 255, 0.3);\r\n        border-bottom: solid 1px #bbb;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse.bootsnav.navbar-transparent.dark,\r\n    nav.navbar.bootsnav.navbar-transparent.dark {\r\n        background-color: rgba(0, 0, 0, 0.3);\r\n        border-bottom: solid 1px #555;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-transparent.white .attr-nav {\r\n        border-left: solid 1px #bbb;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse.bootsnav.navbar-transparent.dark .attr-nav,\r\n    nav.navbar.bootsnav.navbar-transparent.dark .attr-nav {\r\n        border-left: solid 1px #555;\r\n    }\r\n\r\n    nav.navbar.bootsnav.no-background.white .attr-nav > ul > li > a,\r\n    nav.navbar.bootsnav.navbar-transparent.white .attr-nav > ul > li > a,\r\n    nav.navbar.bootsnav.navbar-transparent.white ul.nav > li > a,\r\n    nav.navbar.bootsnav.no-background.white ul.nav > li > a {\r\n        color: #fff;\r\n    }\r\n\r\n    nav.navbar.bootsnav.navbar-transparent.dark .attr-nav > ul > li > a,\r\n    nav.navbar.bootsnav.navbar-transparent.dark ul.nav > li > a {\r\n        color: #eee;\r\n    }\r\n}\r\n\r\n@media (max-width: 992px) {\r\n    /* Navbar General ------*/\r\n\r\n    nav.navbar .navbar-brand {\r\n        margin-top: 0;\r\n        position: relative;\r\n        top: -2px;\r\n    }\r\n\r\n        nav.navbar .navbar-brand img.logo {\r\n            width: 50px;\r\n        }\r\n\r\n    .attr-nav > ul > li > a {\r\n        padding: 16px 15px 15px;\r\n    }\r\n    /* Navbar Mobile slide ------*/\r\n\r\n    nav.navbar.navbar-mobile ul.nav > li > a {\r\n        padding: 15px 15px;\r\n    }\r\n\r\n    nav.navbar.navbar-mobile ul.nav ul.dropdown-menu > li > a {\r\n        padding-right: 15px !important;\r\n        padding-top: 15px !important;\r\n        padding-bottom: 15px !important;\r\n    }\r\n\r\n    nav.navbar.navbar-mobile ul.nav ul.dropdown-menu .col-menu .title {\r\n        padding-right: 30px !important;\r\n        padding-top: 13px !important;\r\n        padding-bottom: 13px !important;\r\n    }\r\n\r\n    nav.navbar.navbar-mobile ul.nav ul.dropdown-menu .col-menu ul.menu-col li a {\r\n        padding-top: 13px !important;\r\n        padding-bottom: 13px !important;\r\n    }\r\n    /* Navbar Full ------*/\r\n\r\n    nav.navbar-full .navbar-brand {\r\n        top: 0;\r\n        padding-top: 10px;\r\n    }\r\n}\r\n/* Navbar Inverse\r\n=================================*/\r\n\r\nnav.navbar.navbar-inverse {\r\n    background-color: #222;\r\n    border-bottom: solid 1px #303030;\r\n}\r\n\r\n    nav.navbar.navbar-inverse ul.cart-list > li.total > .btn {\r\n        border-bottom: solid 1px #222 !important;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse ul.cart-list > li.total .pull-right {\r\n        color: #fff;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse.megamenu ul.dropdown-menu.megamenu-content .content ul.menu-col li a,\r\n    nav.navbar.navbar-inverse ul.nav > li > a {\r\n        color: #eee;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse ul.nav > li.dropdown > a {\r\n        background-color: #222;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse li.dropdown ul.dropdown-menu > li > a {\r\n        color: #999;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse ul.nav .dropdown-menu h1,\r\n    nav.navbar.navbar-inverse ul.nav .dropdown-menu h2,\r\n    nav.navbar.navbar-inverse ul.nav .dropdown-menu h3,\r\n    nav.navbar.navbar-inverse ul.nav .dropdown-menu h4,\r\n    nav.navbar.navbar-inverse ul.nav .dropdown-menu h5,\r\n    nav.navbar.navbar-inverse ul.nav .dropdown-menu h6 {\r\n        color: #fff;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse .form-control {\r\n        background-color: #333;\r\n        border-color: #303030;\r\n        color: #fff;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse .attr-nav > ul > li > a {\r\n        color: #eee;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse .attr-nav > ul > li.dropdown ul.dropdown-menu {\r\n        background-color: #222;\r\n        border-left: solid 1px #303030;\r\n        border-bottom: solid 1px #303030;\r\n        border-right: solid 1px #303030;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse ul.cart-list > li {\r\n        border-bottom: solid 1px #303030;\r\n        color: #eee;\r\n    }\r\n\r\n        nav.navbar.navbar-inverse ul.cart-list > li img {\r\n            border: solid 1px #303030;\r\n        }\r\n\r\n        nav.navbar.navbar-inverse ul.cart-list > li.total {\r\n            background-color: #333;\r\n        }\r\n\r\n    nav.navbar.navbar-inverse .share ul > li > a {\r\n        background-color: #555;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse .dropdown-tabs .tab-menu {\r\n        border-right: solid 1px #303030;\r\n    }\r\n\r\n        nav.navbar.navbar-inverse .dropdown-tabs .tab-menu > ul > li > a {\r\n            border-bottom: solid 1px #303030;\r\n        }\r\n\r\n    nav.navbar.navbar-inverse .dropdown-tabs .tab-content {\r\n        border-left: solid 1px #303030;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse .dropdown-tabs .tab-menu > ul > li > a:hover,\r\n    nav.navbar.navbar-inverse .dropdown-tabs .tab-menu > ul > li > a:focus,\r\n    nav.navbar.navbar-inverse .dropdown-tabs .tab-menu > ul > li.active > a {\r\n        background-color: #333 !important;\r\n    }\r\n\r\nnav.navbar-inverse.navbar-full ul.nav > li > a {\r\n    border: none;\r\n}\r\n\r\nnav.navbar-inverse.navbar-full .navbar-collapse .wrap-full-menu {\r\n    background-color: #222;\r\n}\r\n\r\nnav.navbar-inverse.navbar-full .navbar-toggle {\r\n    background-color: #222 !important;\r\n    color: #6f6f6f;\r\n}\r\n\r\n@media (min-width: 1024px) {\r\n    nav.navbar.navbar-inverse ul.nav .dropdown-menu {\r\n        background-color: #222 !important;\r\n        border-left: solid 1px #303030 !important;\r\n        border-bottom: solid 1px #303030 !important;\r\n        border-right: solid 1px #303030 !important;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse li.dropdown ul.dropdown-menu > li > a {\r\n        border-bottom: solid 1px #303030;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse ul.dropdown-menu.megamenu-content .col-menu {\r\n        border-left: solid 1px #303030;\r\n        border-right: solid 1px #303030;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse.navbar-transparent.dark {\r\n        background-color: rgba(0, 0, 0, 0.3);\r\n        border-bottom: solid 1px #999;\r\n    }\r\n\r\n        nav.navbar.navbar-inverse.navbar-transparent.dark .attr-nav {\r\n            border-left: solid 1px #999;\r\n        }\r\n\r\n            nav.navbar.navbar-inverse.no-background.white .attr-nav > ul > li > a,\r\n            nav.navbar.navbar-inverse.navbar-transparent.dark .attr-nav > ul > li > a,\r\n            nav.navbar.navbar-inverse.navbar-transparent.dark ul.nav > li > a,\r\n            nav.navbar.navbar-inverse.no-background.white ul.nav > li > a {\r\n                color: #fff;\r\n            }\r\n\r\n    nav.navbar.navbar-inverse.no-background.dark .attr-nav > ul > li > a,\r\n    nav.navbar.navbar-inverse.no-background.dark .attr-nav > ul > li > a,\r\n    nav.navbar.navbar-inverse.no-background.dark ul.nav > li > a,\r\n    nav.navbar.navbar-inverse.no-background.dark ul.nav > li > a {\r\n        color: #3f3f3f;\r\n    }\r\n}\r\n\r\n@media (max-width: 992px) {\r\n    nav.navbar.navbar-inverse .navbar-toggle {\r\n        color: #eee;\r\n        background-color: #222 !important;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse .navbar-nav > li > a {\r\n        border-top: solid 1px #303030;\r\n        border-bottom: solid 1px #303030;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse ul.nav li.dropdown ul.dropdown-menu > li > a {\r\n        color: #999;\r\n        border-bottom: solid 1px #303030;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse .dropdown .megamenu-content .col-menu .title {\r\n        border-bottom: solid 1px #303030;\r\n        color: #eee;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse .dropdown .megamenu-content .col-menu ul > li > a {\r\n        border-bottom: solid 1px #303030;\r\n        color: #999 !important;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse .dropdown .megamenu-content .col-menu.on:last-child .title {\r\n        border-bottom: solid 1px #303030;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse .dropdown-tabs .tab-menu > ul {\r\n        border-top: solid 1px #303030;\r\n    }\r\n\r\n    nav.navbar.navbar-inverse.navbar-mobile .navbar-collapse {\r\n        background-color: #222;\r\n    }\r\n}\r\n\r\n@media (max-width: 767px) {\r\n    nav.navbar.navbar-inverse.navbar-mobile ul.nav {\r\n        border-top: solid 1px #222;\r\n    }\r\n}\r\n/*\r\nColor\r\n=========================== */\r\n\r\nnav.navbar.bootsnav ul.dropdown-menu.megamenu-content .content ul.menu-col li a:hover,\r\n.side .widget ul.link li a:hover,\r\n.side .widget ul.link li a:focus,\r\n.check-list li:before,\r\nul.cart-list > li > h6 > a,\r\n.attr-nav > ul > li > a:hover,\r\n.attr-nav > ul > li > a:focus,\r\nnav.navbar-sidebar ul.nav li.dropdown.on > a,\r\nnav.navbar-sidebar .dropdown .megamenu-content .col-menu.on .title,\r\nnav.navbar-sidebar ul.nav li.dropdown ul.dropdown-menu li a:hover,\r\nnav.navbar ul.nav li.dropdown.on > a,\r\nnav.navbar.navbar-inverse ul.nav li.dropdown.on > a,\r\nnav.navbar-sidebar ul.nav li.dropdown.on ul.dropdown-menu li.dropdown.on > a,\r\nnav.navbar .dropdown .megamenu-content .col-menu.on .title,\r\nnav.navbar ul.nav > li > a:hover,\r\nnav.navbar ul.nav > li.active > a:hover,\r\nnav.navbar ul.nav li.active > a,\r\nnav.navbar li.dropdown ul.dropdown-menu > li a:hover {\r\n    color: #0CA579;\r\n}\r\n\r\nnav.navbar.navbar-transparent ul.nav > li > a:hover,\r\nnav.navbar.no-background ul.nav > li > a:hover,\r\nnav.navbar ul.nav li.scroll.active > a,\r\nnav.navbar.navbar-dark ul.nav li.dropdown ul.dropdown-menu > li > a:hover,\r\nnav.navbar ul.nav li.dropdown.on > a,\r\nnav.navbar-dark ul.nav li.dropdown.on > a {\r\n    color: #0CA579 !important;\r\n}\r\n\r\n.router-link-active, .router-link-exact-active {\r\n    color: #0CA579 !important;\r\n}\r\n\r\n@media(max-width:920px) {\r\n    nav.navbar .dropdown .megamenu-content .col-menu ul > li > a:hover, nav.navbar.navbar-dark .dropdown .megamenu-content .col-menu .title:hover {\r\n        color: #0CA579 !important;\r\n    }\r\n}\r\n/*\r\nBorder\r\n=========================== */\r\n\r\nul.cart-list > li.total > .btn {\r\n    border-color: #0CA579;\r\n}\r\n\r\nnav.navbar li.dropdown ul.dropdown-menu {\r\n    border-top-color: #0CA579 !important;\r\n}\r\n/*\r\nBackground\r\n=========================== */\r\nul.cart-list > li.total > .btn,\r\n.attr-nav > ul > li > a span.badge,\r\nnav.navbar .share ul > li > a:hover,\r\nnav.navbar .share ul > li > a:focus {\r\n    background-color: #0CA579;\r\n}\r\n\r\n    ul.cart-list > li.total > .btn:hover,\r\n    ul.cart-list > li.total > .btn:focus {\r\n        background-color: #dc3236 !important;\r\n    }\r\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)();
// imports


// module
exports.push([module.i, "/*!\r\n *  Font Awesome 4.7.0 by @davegandy - http://fontawesome.io - @fontawesome\r\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\r\n */\r\n\r\n@font-face {\r\n    font-family: 'FontAwesome';\r\n    src: url('/fonts/fontawesome-webfont.eot');\r\n    src: url('/fonts/fontawesome-webfont.eot') format('embedded-opentype'),url('/fonts/fontawesome-webfont.woff2') format('woff2'),url('/fonts/fontawesome-webfont.woff') format('woff'),url('/fonts/fontawesome-webfont.ttf') format('truetype'),url('/fonts/fontawesome-webfont.svg#fontawesomeregular') format('svg');\r\n    font-weight: normal;\r\n    font-style: normal\r\n}\r\n\r\n.fa {\r\n    display: inline-block;\r\n    font: normal normal normal 14px/1 FontAwesome;\r\n    font-size: inherit;\r\n    text-rendering: auto;\r\n    -webkit-font-smoothing: antialiased;\r\n    -moz-osx-font-smoothing: grayscale\r\n}\r\n\r\n.fa-lg {\r\n    font-size: 1.33333333em;\r\n    line-height: .75em;\r\n    vertical-align: -15%\r\n}\r\n\r\n.fa-2x {\r\n    font-size: 2em\r\n}\r\n\r\n.fa-3x {\r\n    font-size: 3em\r\n}\r\n\r\n.fa-4x {\r\n    font-size: 4em\r\n}\r\n\r\n.fa-5x {\r\n    font-size: 5em\r\n}\r\n\r\n.fa-fw {\r\n    width: 1.28571429em;\r\n    text-align: center\r\n}\r\n\r\n.fa-ul {\r\n    padding-left: 0;\r\n    margin-left: 2.14285714em;\r\n    list-style-type: none\r\n}\r\n\r\n    .fa-ul > li {\r\n        position: relative\r\n    }\r\n\r\n.fa-li {\r\n    position: absolute;\r\n    left: -2.14285714em;\r\n    width: 2.14285714em;\r\n    top: .14285714em;\r\n    text-align: center\r\n}\r\n\r\n    .fa-li.fa-lg {\r\n        left: -1.85714286em\r\n    }\r\n\r\n.fa-border {\r\n    padding: .2em .25em .15em;\r\n    border: solid .08em #eee;\r\n    border-radius: .1em\r\n}\r\n\r\n.fa-pull-left {\r\n    float: left\r\n}\r\n\r\n.fa-pull-right {\r\n    float: right\r\n}\r\n\r\n.fa.fa-pull-left {\r\n    margin-right: .3em\r\n}\r\n\r\n.fa.fa-pull-right {\r\n    margin-left: .3em\r\n}\r\n\r\n.pull-right {\r\n    float: right\r\n}\r\n\r\n.pull-left {\r\n    float: left\r\n}\r\n\r\n.fa.pull-left {\r\n    margin-right: .3em\r\n}\r\n\r\n.fa.pull-right {\r\n    margin-left: .3em\r\n}\r\n\r\n.fa-spin {\r\n    -webkit-animation: fa-spin 2s infinite linear;\r\n    animation: fa-spin 2s infinite linear\r\n}\r\n\r\n.fa-pulse {\r\n    -webkit-animation: fa-spin 1s infinite steps(8);\r\n    animation: fa-spin 1s infinite steps(8)\r\n}\r\n\r\n@-webkit-keyframes fa-spin {\r\n    0% {\r\n        -webkit-transform: rotate(0deg);\r\n        transform: rotate(0deg)\r\n    }\r\n\r\n    100% {\r\n        -webkit-transform: rotate(359deg);\r\n        transform: rotate(359deg)\r\n    }\r\n}\r\n\r\n@keyframes fa-spin {\r\n    0% {\r\n        -webkit-transform: rotate(0deg);\r\n        transform: rotate(0deg)\r\n    }\r\n\r\n    100% {\r\n        -webkit-transform: rotate(359deg);\r\n        transform: rotate(359deg)\r\n    }\r\n}\r\n\r\n.fa-rotate-90 {\r\n    -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\r\n    -webkit-transform: rotate(90deg);\r\n    -ms-transform: rotate(90deg);\r\n    transform: rotate(90deg)\r\n}\r\n\r\n.fa-rotate-180 {\r\n    -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\r\n    -webkit-transform: rotate(180deg);\r\n    -ms-transform: rotate(180deg);\r\n    transform: rotate(180deg)\r\n}\r\n\r\n.fa-rotate-270 {\r\n    -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\r\n    -webkit-transform: rotate(270deg);\r\n    -ms-transform: rotate(270deg);\r\n    transform: rotate(270deg)\r\n}\r\n\r\n.fa-flip-horizontal {\r\n    -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\r\n    -webkit-transform: scale(-1, 1);\r\n    -ms-transform: scale(-1, 1);\r\n    transform: scale(-1, 1)\r\n}\r\n\r\n.fa-flip-vertical {\r\n    -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\r\n    -webkit-transform: scale(1, -1);\r\n    -ms-transform: scale(1, -1);\r\n    transform: scale(1, -1)\r\n}\r\n\r\n:root .fa-rotate-90, :root .fa-rotate-180, :root .fa-rotate-270, :root .fa-flip-horizontal, :root .fa-flip-vertical {\r\n    filter: none\r\n}\r\n\r\n.fa-stack {\r\n    position: relative;\r\n    display: inline-block;\r\n    width: 2em;\r\n    height: 2em;\r\n    line-height: 2em;\r\n    vertical-align: middle\r\n}\r\n\r\n.fa-stack-1x, .fa-stack-2x {\r\n    position: absolute;\r\n    left: 0;\r\n    width: 100%;\r\n    text-align: center\r\n}\r\n\r\n.fa-stack-1x {\r\n    line-height: inherit\r\n}\r\n\r\n.fa-stack-2x {\r\n    font-size: 2em\r\n}\r\n\r\n.fa-inverse {\r\n    color: #fff\r\n}\r\n\r\n.fa-glass:before {\r\n    content: \"\\F000\"\r\n}\r\n\r\n.fa-music:before {\r\n    content: \"\\F001\"\r\n}\r\n\r\n.fa-search:before {\r\n    content: \"\\F002\"\r\n}\r\n\r\n.fa-envelope-o:before {\r\n    content: \"\\F003\"\r\n}\r\n\r\n.fa-heart:before {\r\n    content: \"\\F004\"\r\n}\r\n\r\n.fa-star:before {\r\n    content: \"\\F005\"\r\n}\r\n\r\n.fa-star-o:before {\r\n    content: \"\\F006\"\r\n}\r\n\r\n.fa-user:before {\r\n    content: \"\\F007\"\r\n}\r\n\r\n.fa-film:before {\r\n    content: \"\\F008\"\r\n}\r\n\r\n.fa-th-large:before {\r\n    content: \"\\F009\"\r\n}\r\n\r\n.fa-th:before {\r\n    content: \"\\F00A\"\r\n}\r\n\r\n.fa-th-list:before {\r\n    content: \"\\F00B\"\r\n}\r\n\r\n.fa-check:before {\r\n    content: \"\\F00C\"\r\n}\r\n\r\n.fa-remove:before, .fa-close:before, .fa-times:before {\r\n    content: \"\\F00D\"\r\n}\r\n\r\n.fa-search-plus:before {\r\n    content: \"\\F00E\"\r\n}\r\n\r\n.fa-search-minus:before {\r\n    content: \"\\F010\"\r\n}\r\n\r\n.fa-power-off:before {\r\n    content: \"\\F011\"\r\n}\r\n\r\n.fa-signal:before {\r\n    content: \"\\F012\"\r\n}\r\n\r\n.fa-gear:before, .fa-cog:before {\r\n    content: \"\\F013\"\r\n}\r\n\r\n.fa-trash-o:before {\r\n    content: \"\\F014\"\r\n}\r\n\r\n.fa-home:before {\r\n    content: \"\\F015\"\r\n}\r\n\r\n.fa-file-o:before {\r\n    content: \"\\F016\"\r\n}\r\n\r\n.fa-clock-o:before {\r\n    content: \"\\F017\"\r\n}\r\n\r\n.fa-road:before {\r\n    content: \"\\F018\"\r\n}\r\n\r\n.fa-download:before {\r\n    content: \"\\F019\"\r\n}\r\n\r\n.fa-arrow-circle-o-down:before {\r\n    content: \"\\F01A\"\r\n}\r\n\r\n.fa-arrow-circle-o-up:before {\r\n    content: \"\\F01B\"\r\n}\r\n\r\n.fa-inbox:before {\r\n    content: \"\\F01C\"\r\n}\r\n\r\n.fa-play-circle-o:before {\r\n    content: \"\\F01D\"\r\n}\r\n\r\n.fa-rotate-right:before, .fa-repeat:before {\r\n    content: \"\\F01E\"\r\n}\r\n\r\n.fa-refresh:before {\r\n    content: \"\\F021\"\r\n}\r\n\r\n.fa-list-alt:before {\r\n    content: \"\\F022\"\r\n}\r\n\r\n.fa-lock:before {\r\n    content: \"\\F023\"\r\n}\r\n\r\n.fa-flag:before {\r\n    content: \"\\F024\"\r\n}\r\n\r\n.fa-headphones:before {\r\n    content: \"\\F025\"\r\n}\r\n\r\n.fa-volume-off:before {\r\n    content: \"\\F026\"\r\n}\r\n\r\n.fa-volume-down:before {\r\n    content: \"\\F027\"\r\n}\r\n\r\n.fa-volume-up:before {\r\n    content: \"\\F028\"\r\n}\r\n\r\n.fa-qrcode:before {\r\n    content: \"\\F029\"\r\n}\r\n\r\n.fa-barcode:before {\r\n    content: \"\\F02A\"\r\n}\r\n\r\n.fa-tag:before {\r\n    content: \"\\F02B\"\r\n}\r\n\r\n.fa-tags:before {\r\n    content: \"\\F02C\"\r\n}\r\n\r\n.fa-book:before {\r\n    content: \"\\F02D\"\r\n}\r\n\r\n.fa-bookmark:before {\r\n    content: \"\\F02E\"\r\n}\r\n\r\n.fa-print:before {\r\n    content: \"\\F02F\"\r\n}\r\n\r\n.fa-camera:before {\r\n    content: \"\\F030\"\r\n}\r\n\r\n.fa-font:before {\r\n    content: \"\\F031\"\r\n}\r\n\r\n.fa-bold:before {\r\n    content: \"\\F032\"\r\n}\r\n\r\n.fa-italic:before {\r\n    content: \"\\F033\"\r\n}\r\n\r\n.fa-text-height:before {\r\n    content: \"\\F034\"\r\n}\r\n\r\n.fa-text-width:before {\r\n    content: \"\\F035\"\r\n}\r\n\r\n.fa-align-left:before {\r\n    content: \"\\F036\"\r\n}\r\n\r\n.fa-align-center:before {\r\n    content: \"\\F037\"\r\n}\r\n\r\n.fa-align-right:before {\r\n    content: \"\\F038\"\r\n}\r\n\r\n.fa-align-justify:before {\r\n    content: \"\\F039\"\r\n}\r\n\r\n.fa-list:before {\r\n    content: \"\\F03A\"\r\n}\r\n\r\n.fa-dedent:before, .fa-outdent:before {\r\n    content: \"\\F03B\"\r\n}\r\n\r\n.fa-indent:before {\r\n    content: \"\\F03C\"\r\n}\r\n\r\n.fa-video-camera:before {\r\n    content: \"\\F03D\"\r\n}\r\n\r\n.fa-photo:before, .fa-image:before, .fa-picture-o:before {\r\n    content: \"\\F03E\"\r\n}\r\n\r\n.fa-pencil:before {\r\n    content: \"\\F040\"\r\n}\r\n\r\n.fa-map-marker:before {\r\n    content: \"\\F041\"\r\n}\r\n\r\n.fa-adjust:before {\r\n    content: \"\\F042\"\r\n}\r\n\r\n.fa-tint:before {\r\n    content: \"\\F043\"\r\n}\r\n\r\n.fa-edit:before, .fa-pencil-square-o:before {\r\n    content: \"\\F044\"\r\n}\r\n\r\n.fa-share-square-o:before {\r\n    content: \"\\F045\"\r\n}\r\n\r\n.fa-check-square-o:before {\r\n    content: \"\\F046\"\r\n}\r\n\r\n.fa-arrows:before {\r\n    content: \"\\F047\"\r\n}\r\n\r\n.fa-step-backward:before {\r\n    content: \"\\F048\"\r\n}\r\n\r\n.fa-fast-backward:before {\r\n    content: \"\\F049\"\r\n}\r\n\r\n.fa-backward:before {\r\n    content: \"\\F04A\"\r\n}\r\n\r\n.fa-play:before {\r\n    content: \"\\F04B\"\r\n}\r\n\r\n.fa-pause:before {\r\n    content: \"\\F04C\"\r\n}\r\n\r\n.fa-stop:before {\r\n    content: \"\\F04D\"\r\n}\r\n\r\n.fa-forward:before {\r\n    content: \"\\F04E\"\r\n}\r\n\r\n.fa-fast-forward:before {\r\n    content: \"\\F050\"\r\n}\r\n\r\n.fa-step-forward:before {\r\n    content: \"\\F051\"\r\n}\r\n\r\n.fa-eject:before {\r\n    content: \"\\F052\"\r\n}\r\n\r\n.fa-chevron-left:before {\r\n    content: \"\\F053\"\r\n}\r\n\r\n.fa-chevron-right:before {\r\n    content: \"\\F054\"\r\n}\r\n\r\n.fa-plus-circle:before {\r\n    content: \"\\F055\"\r\n}\r\n\r\n.fa-minus-circle:before {\r\n    content: \"\\F056\"\r\n}\r\n\r\n.fa-times-circle:before {\r\n    content: \"\\F057\"\r\n}\r\n\r\n.fa-check-circle:before {\r\n    content: \"\\F058\"\r\n}\r\n\r\n.fa-question-circle:before {\r\n    content: \"\\F059\"\r\n}\r\n\r\n.fa-info-circle:before {\r\n    content: \"\\F05A\"\r\n}\r\n\r\n.fa-crosshairs:before {\r\n    content: \"\\F05B\"\r\n}\r\n\r\n.fa-times-circle-o:before {\r\n    content: \"\\F05C\"\r\n}\r\n\r\n.fa-check-circle-o:before {\r\n    content: \"\\F05D\"\r\n}\r\n\r\n.fa-ban:before {\r\n    content: \"\\F05E\"\r\n}\r\n\r\n.fa-arrow-left:before {\r\n    content: \"\\F060\"\r\n}\r\n\r\n.fa-arrow-right:before {\r\n    content: \"\\F061\"\r\n}\r\n\r\n.fa-arrow-up:before {\r\n    content: \"\\F062\"\r\n}\r\n\r\n.fa-arrow-down:before {\r\n    content: \"\\F063\"\r\n}\r\n\r\n.fa-mail-forward:before, .fa-share:before {\r\n    content: \"\\F064\"\r\n}\r\n\r\n.fa-expand:before {\r\n    content: \"\\F065\"\r\n}\r\n\r\n.fa-compress:before {\r\n    content: \"\\F066\"\r\n}\r\n\r\n.fa-plus:before {\r\n    content: \"\\F067\"\r\n}\r\n\r\n.fa-minus:before {\r\n    content: \"\\F068\"\r\n}\r\n\r\n.fa-asterisk:before {\r\n    content: \"\\F069\"\r\n}\r\n\r\n.fa-exclamation-circle:before {\r\n    content: \"\\F06A\"\r\n}\r\n\r\n.fa-gift:before {\r\n    content: \"\\F06B\"\r\n}\r\n\r\n.fa-leaf:before {\r\n    content: \"\\F06C\"\r\n}\r\n\r\n.fa-fire:before {\r\n    content: \"\\F06D\"\r\n}\r\n\r\n.fa-eye:before {\r\n    content: \"\\F06E\"\r\n}\r\n\r\n.fa-eye-slash:before {\r\n    content: \"\\F070\"\r\n}\r\n\r\n.fa-warning:before, .fa-exclamation-triangle:before {\r\n    content: \"\\F071\"\r\n}\r\n\r\n.fa-plane:before {\r\n    content: \"\\F072\"\r\n}\r\n\r\n.fa-calendar:before {\r\n    content: \"\\F073\"\r\n}\r\n\r\n.fa-random:before {\r\n    content: \"\\F074\"\r\n}\r\n\r\n.fa-comment:before {\r\n    content: \"\\F075\"\r\n}\r\n\r\n.fa-magnet:before {\r\n    content: \"\\F076\"\r\n}\r\n\r\n.fa-chevron-up:before {\r\n    content: \"\\F077\"\r\n}\r\n\r\n.fa-chevron-down:before {\r\n    content: \"\\F078\"\r\n}\r\n\r\n.fa-retweet:before {\r\n    content: \"\\F079\"\r\n}\r\n\r\n.fa-shopping-cart:before {\r\n    content: \"\\F07A\"\r\n}\r\n\r\n.fa-folder:before {\r\n    content: \"\\F07B\"\r\n}\r\n\r\n.fa-folder-open:before {\r\n    content: \"\\F07C\"\r\n}\r\n\r\n.fa-arrows-v:before {\r\n    content: \"\\F07D\"\r\n}\r\n\r\n.fa-arrows-h:before {\r\n    content: \"\\F07E\"\r\n}\r\n\r\n.fa-bar-chart-o:before, .fa-bar-chart:before {\r\n    content: \"\\F080\"\r\n}\r\n\r\n.fa-twitter-square:before {\r\n    content: \"\\F081\"\r\n}\r\n\r\n.fa-facebook-square:before {\r\n    content: \"\\F082\"\r\n}\r\n\r\n.fa-camera-retro:before {\r\n    content: \"\\F083\"\r\n}\r\n\r\n.fa-key:before {\r\n    content: \"\\F084\"\r\n}\r\n\r\n.fa-gears:before, .fa-cogs:before {\r\n    content: \"\\F085\"\r\n}\r\n\r\n.fa-comments:before {\r\n    content: \"\\F086\"\r\n}\r\n\r\n.fa-thumbs-o-up:before {\r\n    content: \"\\F087\"\r\n}\r\n\r\n.fa-thumbs-o-down:before {\r\n    content: \"\\F088\"\r\n}\r\n\r\n.fa-star-half:before {\r\n    content: \"\\F089\"\r\n}\r\n\r\n.fa-heart-o:before {\r\n    content: \"\\F08A\"\r\n}\r\n\r\n.fa-sign-out:before {\r\n    content: \"\\F08B\"\r\n}\r\n\r\n.fa-linkedin-square:before {\r\n    content: \"\\F08C\"\r\n}\r\n\r\n.fa-thumb-tack:before {\r\n    content: \"\\F08D\"\r\n}\r\n\r\n.fa-external-link:before {\r\n    content: \"\\F08E\"\r\n}\r\n\r\n.fa-sign-in:before {\r\n    content: \"\\F090\"\r\n}\r\n\r\n.fa-trophy:before {\r\n    content: \"\\F091\"\r\n}\r\n\r\n.fa-github-square:before {\r\n    content: \"\\F092\"\r\n}\r\n\r\n.fa-upload:before {\r\n    content: \"\\F093\"\r\n}\r\n\r\n.fa-lemon-o:before {\r\n    content: \"\\F094\"\r\n}\r\n\r\n.fa-phone:before {\r\n    content: \"\\F095\"\r\n}\r\n\r\n.fa-square-o:before {\r\n    content: \"\\F096\"\r\n}\r\n\r\n.fa-bookmark-o:before {\r\n    content: \"\\F097\"\r\n}\r\n\r\n.fa-phone-square:before {\r\n    content: \"\\F098\"\r\n}\r\n\r\n.fa-twitter:before {\r\n    content: \"\\F099\"\r\n}\r\n\r\n.fa-facebook-f:before, .fa-facebook:before {\r\n    content: \"\\F09A\"\r\n}\r\n\r\n.fa-github:before {\r\n    content: \"\\F09B\"\r\n}\r\n\r\n.fa-unlock:before {\r\n    content: \"\\F09C\"\r\n}\r\n\r\n.fa-credit-card:before {\r\n    content: \"\\F09D\"\r\n}\r\n\r\n.fa-feed:before, .fa-rss:before {\r\n    content: \"\\F09E\"\r\n}\r\n\r\n.fa-hdd-o:before {\r\n    content: \"\\F0A0\"\r\n}\r\n\r\n.fa-bullhorn:before {\r\n    content: \"\\F0A1\"\r\n}\r\n\r\n.fa-bell:before {\r\n    content: \"\\F0F3\"\r\n}\r\n\r\n.fa-certificate:before {\r\n    content: \"\\F0A3\"\r\n}\r\n\r\n.fa-hand-o-right:before {\r\n    content: \"\\F0A4\"\r\n}\r\n\r\n.fa-hand-o-left:before {\r\n    content: \"\\F0A5\"\r\n}\r\n\r\n.fa-hand-o-up:before {\r\n    content: \"\\F0A6\"\r\n}\r\n\r\n.fa-hand-o-down:before {\r\n    content: \"\\F0A7\"\r\n}\r\n\r\n.fa-arrow-circle-left:before {\r\n    content: \"\\F0A8\"\r\n}\r\n\r\n.fa-arrow-circle-right:before {\r\n    content: \"\\F0A9\"\r\n}\r\n\r\n.fa-arrow-circle-up:before {\r\n    content: \"\\F0AA\"\r\n}\r\n\r\n.fa-arrow-circle-down:before {\r\n    content: \"\\F0AB\"\r\n}\r\n\r\n.fa-globe:before {\r\n    content: \"\\F0AC\"\r\n}\r\n\r\n.fa-wrench:before {\r\n    content: \"\\F0AD\"\r\n}\r\n\r\n.fa-tasks:before {\r\n    content: \"\\F0AE\"\r\n}\r\n\r\n.fa-filter:before {\r\n    content: \"\\F0B0\"\r\n}\r\n\r\n.fa-briefcase:before {\r\n    content: \"\\F0B1\"\r\n}\r\n\r\n.fa-arrows-alt:before {\r\n    content: \"\\F0B2\"\r\n}\r\n\r\n.fa-group:before, .fa-users:before {\r\n    content: \"\\F0C0\"\r\n}\r\n\r\n.fa-chain:before, .fa-link:before {\r\n    content: \"\\F0C1\"\r\n}\r\n\r\n.fa-cloud:before {\r\n    content: \"\\F0C2\"\r\n}\r\n\r\n.fa-flask:before {\r\n    content: \"\\F0C3\"\r\n}\r\n\r\n.fa-cut:before, .fa-scissors:before {\r\n    content: \"\\F0C4\"\r\n}\r\n\r\n.fa-copy:before, .fa-files-o:before {\r\n    content: \"\\F0C5\"\r\n}\r\n\r\n.fa-paperclip:before {\r\n    content: \"\\F0C6\"\r\n}\r\n\r\n.fa-save:before, .fa-floppy-o:before {\r\n    content: \"\\F0C7\"\r\n}\r\n\r\n.fa-square:before {\r\n    content: \"\\F0C8\"\r\n}\r\n\r\n.fa-navicon:before, .fa-reorder:before, .fa-bars:before {\r\n    content: \"\\F0C9\"\r\n}\r\n\r\n.fa-list-ul:before {\r\n    content: \"\\F0CA\"\r\n}\r\n\r\n.fa-list-ol:before {\r\n    content: \"\\F0CB\"\r\n}\r\n\r\n.fa-strikethrough:before {\r\n    content: \"\\F0CC\"\r\n}\r\n\r\n.fa-underline:before {\r\n    content: \"\\F0CD\"\r\n}\r\n\r\n.fa-table:before {\r\n    content: \"\\F0CE\"\r\n}\r\n\r\n.fa-magic:before {\r\n    content: \"\\F0D0\"\r\n}\r\n\r\n.fa-truck:before {\r\n    content: \"\\F0D1\"\r\n}\r\n\r\n.fa-pinterest:before {\r\n    content: \"\\F0D2\"\r\n}\r\n\r\n.fa-pinterest-square:before {\r\n    content: \"\\F0D3\"\r\n}\r\n\r\n.fa-google-plus-square:before {\r\n    content: \"\\F0D4\"\r\n}\r\n\r\n.fa-google-plus:before {\r\n    content: \"\\F0D5\"\r\n}\r\n\r\n.fa-money:before {\r\n    content: \"\\F0D6\"\r\n}\r\n\r\n.fa-caret-down:before {\r\n    content: \"\\F0D7\"\r\n}\r\n\r\n.fa-caret-up:before {\r\n    content: \"\\F0D8\"\r\n}\r\n\r\n.fa-caret-left:before {\r\n    content: \"\\F0D9\"\r\n}\r\n\r\n.fa-caret-right:before {\r\n    content: \"\\F0DA\"\r\n}\r\n\r\n.fa-columns:before {\r\n    content: \"\\F0DB\"\r\n}\r\n\r\n.fa-unsorted:before, .fa-sort:before {\r\n    content: \"\\F0DC\"\r\n}\r\n\r\n.fa-sort-down:before, .fa-sort-desc:before {\r\n    content: \"\\F0DD\"\r\n}\r\n\r\n.fa-sort-up:before, .fa-sort-asc:before {\r\n    content: \"\\F0DE\"\r\n}\r\n\r\n.fa-envelope:before {\r\n    content: \"\\F0E0\"\r\n}\r\n\r\n.fa-linkedin:before {\r\n    content: \"\\F0E1\"\r\n}\r\n\r\n.fa-rotate-left:before, .fa-undo:before {\r\n    content: \"\\F0E2\"\r\n}\r\n\r\n.fa-legal:before, .fa-gavel:before {\r\n    content: \"\\F0E3\"\r\n}\r\n\r\n.fa-dashboard:before, .fa-tachometer:before {\r\n    content: \"\\F0E4\"\r\n}\r\n\r\n.fa-comment-o:before {\r\n    content: \"\\F0E5\"\r\n}\r\n\r\n.fa-comments-o:before {\r\n    content: \"\\F0E6\"\r\n}\r\n\r\n.fa-flash:before, .fa-bolt:before {\r\n    content: \"\\F0E7\"\r\n}\r\n\r\n.fa-sitemap:before {\r\n    content: \"\\F0E8\"\r\n}\r\n\r\n.fa-umbrella:before {\r\n    content: \"\\F0E9\"\r\n}\r\n\r\n.fa-paste:before, .fa-clipboard:before {\r\n    content: \"\\F0EA\"\r\n}\r\n\r\n.fa-lightbulb-o:before {\r\n    content: \"\\F0EB\"\r\n}\r\n\r\n.fa-exchange:before {\r\n    content: \"\\F0EC\"\r\n}\r\n\r\n.fa-cloud-download:before {\r\n    content: \"\\F0ED\"\r\n}\r\n\r\n.fa-cloud-upload:before {\r\n    content: \"\\F0EE\"\r\n}\r\n\r\n.fa-user-md:before {\r\n    content: \"\\F0F0\"\r\n}\r\n\r\n.fa-stethoscope:before {\r\n    content: \"\\F0F1\"\r\n}\r\n\r\n.fa-suitcase:before {\r\n    content: \"\\F0F2\"\r\n}\r\n\r\n.fa-bell-o:before {\r\n    content: \"\\F0A2\"\r\n}\r\n\r\n.fa-coffee:before {\r\n    content: \"\\F0F4\"\r\n}\r\n\r\n.fa-cutlery:before {\r\n    content: \"\\F0F5\"\r\n}\r\n\r\n.fa-file-text-o:before {\r\n    content: \"\\F0F6\"\r\n}\r\n\r\n.fa-building-o:before {\r\n    content: \"\\F0F7\"\r\n}\r\n\r\n.fa-hospital-o:before {\r\n    content: \"\\F0F8\"\r\n}\r\n\r\n.fa-ambulance:before {\r\n    content: \"\\F0F9\"\r\n}\r\n\r\n.fa-medkit:before {\r\n    content: \"\\F0FA\"\r\n}\r\n\r\n.fa-fighter-jet:before {\r\n    content: \"\\F0FB\"\r\n}\r\n\r\n.fa-beer:before {\r\n    content: \"\\F0FC\"\r\n}\r\n\r\n.fa-h-square:before {\r\n    content: \"\\F0FD\"\r\n}\r\n\r\n.fa-plus-square:before {\r\n    content: \"\\F0FE\"\r\n}\r\n\r\n.fa-angle-double-left:before {\r\n    content: \"\\F100\"\r\n}\r\n\r\n.fa-angle-double-right:before {\r\n    content: \"\\F101\"\r\n}\r\n\r\n.fa-angle-double-up:before {\r\n    content: \"\\F102\"\r\n}\r\n\r\n.fa-angle-double-down:before {\r\n    content: \"\\F103\"\r\n}\r\n\r\n.fa-angle-left:before {\r\n    content: \"\\F104\"\r\n}\r\n\r\n.fa-angle-right:before {\r\n    content: \"\\F105\"\r\n}\r\n\r\n.fa-angle-up:before {\r\n    content: \"\\F106\"\r\n}\r\n\r\n.fa-angle-down:before {\r\n    content: \"\\F107\"\r\n}\r\n\r\n.fa-desktop:before {\r\n    content: \"\\F108\"\r\n}\r\n\r\n.fa-laptop:before {\r\n    content: \"\\F109\"\r\n}\r\n\r\n.fa-tablet:before {\r\n    content: \"\\F10A\"\r\n}\r\n\r\n.fa-mobile-phone:before, .fa-mobile:before {\r\n    content: \"\\F10B\"\r\n}\r\n\r\n.fa-circle-o:before {\r\n    content: \"\\F10C\"\r\n}\r\n\r\n.fa-quote-left:before {\r\n    content: \"\\F10D\"\r\n}\r\n\r\n.fa-quote-right:before {\r\n    content: \"\\F10E\"\r\n}\r\n\r\n.fa-spinner:before {\r\n    content: \"\\F110\"\r\n}\r\n\r\n.fa-circle:before {\r\n    content: \"\\F111\"\r\n}\r\n\r\n.fa-mail-reply:before, .fa-reply:before {\r\n    content: \"\\F112\"\r\n}\r\n\r\n.fa-github-alt:before {\r\n    content: \"\\F113\"\r\n}\r\n\r\n.fa-folder-o:before {\r\n    content: \"\\F114\"\r\n}\r\n\r\n.fa-folder-open-o:before {\r\n    content: \"\\F115\"\r\n}\r\n\r\n.fa-smile-o:before {\r\n    content: \"\\F118\"\r\n}\r\n\r\n.fa-frown-o:before {\r\n    content: \"\\F119\"\r\n}\r\n\r\n.fa-meh-o:before {\r\n    content: \"\\F11A\"\r\n}\r\n\r\n.fa-gamepad:before {\r\n    content: \"\\F11B\"\r\n}\r\n\r\n.fa-keyboard-o:before {\r\n    content: \"\\F11C\"\r\n}\r\n\r\n.fa-flag-o:before {\r\n    content: \"\\F11D\"\r\n}\r\n\r\n.fa-flag-checkered:before {\r\n    content: \"\\F11E\"\r\n}\r\n\r\n.fa-terminal:before {\r\n    content: \"\\F120\"\r\n}\r\n\r\n.fa-code:before {\r\n    content: \"\\F121\"\r\n}\r\n\r\n.fa-mail-reply-all:before, .fa-reply-all:before {\r\n    content: \"\\F122\"\r\n}\r\n\r\n.fa-star-half-empty:before, .fa-star-half-full:before, .fa-star-half-o:before {\r\n    content: \"\\F123\"\r\n}\r\n\r\n.fa-location-arrow:before {\r\n    content: \"\\F124\"\r\n}\r\n\r\n.fa-crop:before {\r\n    content: \"\\F125\"\r\n}\r\n\r\n.fa-code-fork:before {\r\n    content: \"\\F126\"\r\n}\r\n\r\n.fa-unlink:before, .fa-chain-broken:before {\r\n    content: \"\\F127\"\r\n}\r\n\r\n.fa-question:before {\r\n    content: \"\\F128\"\r\n}\r\n\r\n.fa-info:before {\r\n    content: \"\\F129\"\r\n}\r\n\r\n.fa-exclamation:before {\r\n    content: \"\\F12A\"\r\n}\r\n\r\n.fa-superscript:before {\r\n    content: \"\\F12B\"\r\n}\r\n\r\n.fa-subscript:before {\r\n    content: \"\\F12C\"\r\n}\r\n\r\n.fa-eraser:before {\r\n    content: \"\\F12D\"\r\n}\r\n\r\n.fa-puzzle-piece:before {\r\n    content: \"\\F12E\"\r\n}\r\n\r\n.fa-microphone:before {\r\n    content: \"\\F130\"\r\n}\r\n\r\n.fa-microphone-slash:before {\r\n    content: \"\\F131\"\r\n}\r\n\r\n.fa-shield:before {\r\n    content: \"\\F132\"\r\n}\r\n\r\n.fa-calendar-o:before {\r\n    content: \"\\F133\"\r\n}\r\n\r\n.fa-fire-extinguisher:before {\r\n    content: \"\\F134\"\r\n}\r\n\r\n.fa-rocket:before {\r\n    content: \"\\F135\"\r\n}\r\n\r\n.fa-maxcdn:before {\r\n    content: \"\\F136\"\r\n}\r\n\r\n.fa-chevron-circle-left:before {\r\n    content: \"\\F137\"\r\n}\r\n\r\n.fa-chevron-circle-right:before {\r\n    content: \"\\F138\"\r\n}\r\n\r\n.fa-chevron-circle-up:before {\r\n    content: \"\\F139\"\r\n}\r\n\r\n.fa-chevron-circle-down:before {\r\n    content: \"\\F13A\"\r\n}\r\n\r\n.fa-html5:before {\r\n    content: \"\\F13B\"\r\n}\r\n\r\n.fa-css3:before {\r\n    content: \"\\F13C\"\r\n}\r\n\r\n.fa-anchor:before {\r\n    content: \"\\F13D\"\r\n}\r\n\r\n.fa-unlock-alt:before {\r\n    content: \"\\F13E\"\r\n}\r\n\r\n.fa-bullseye:before {\r\n    content: \"\\F140\"\r\n}\r\n\r\n.fa-ellipsis-h:before {\r\n    content: \"\\F141\"\r\n}\r\n\r\n.fa-ellipsis-v:before {\r\n    content: \"\\F142\"\r\n}\r\n\r\n.fa-rss-square:before {\r\n    content: \"\\F143\"\r\n}\r\n\r\n.fa-play-circle:before {\r\n    content: \"\\F144\"\r\n}\r\n\r\n.fa-ticket:before {\r\n    content: \"\\F145\"\r\n}\r\n\r\n.fa-minus-square:before {\r\n    content: \"\\F146\"\r\n}\r\n\r\n.fa-minus-square-o:before {\r\n    content: \"\\F147\"\r\n}\r\n\r\n.fa-level-up:before {\r\n    content: \"\\F148\"\r\n}\r\n\r\n.fa-level-down:before {\r\n    content: \"\\F149\"\r\n}\r\n\r\n.fa-check-square:before {\r\n    content: \"\\F14A\"\r\n}\r\n\r\n.fa-pencil-square:before {\r\n    content: \"\\F14B\"\r\n}\r\n\r\n.fa-external-link-square:before {\r\n    content: \"\\F14C\"\r\n}\r\n\r\n.fa-share-square:before {\r\n    content: \"\\F14D\"\r\n}\r\n\r\n.fa-compass:before {\r\n    content: \"\\F14E\"\r\n}\r\n\r\n.fa-toggle-down:before, .fa-caret-square-o-down:before {\r\n    content: \"\\F150\"\r\n}\r\n\r\n.fa-toggle-up:before, .fa-caret-square-o-up:before {\r\n    content: \"\\F151\"\r\n}\r\n\r\n.fa-toggle-right:before, .fa-caret-square-o-right:before {\r\n    content: \"\\F152\"\r\n}\r\n\r\n.fa-euro:before, .fa-eur:before {\r\n    content: \"\\F153\"\r\n}\r\n\r\n.fa-gbp:before {\r\n    content: \"\\F154\"\r\n}\r\n\r\n.fa-dollar:before, .fa-usd:before {\r\n    content: \"\\F155\"\r\n}\r\n\r\n.fa-rupee:before, .fa-inr:before {\r\n    content: \"\\F156\"\r\n}\r\n\r\n.fa-cny:before, .fa-rmb:before, .fa-yen:before, .fa-jpy:before {\r\n    content: \"\\F157\"\r\n}\r\n\r\n.fa-ruble:before, .fa-rouble:before, .fa-rub:before {\r\n    content: \"\\F158\"\r\n}\r\n\r\n.fa-won:before, .fa-krw:before {\r\n    content: \"\\F159\"\r\n}\r\n\r\n.fa-bitcoin:before, .fa-btc:before {\r\n    content: \"\\F15A\"\r\n}\r\n\r\n.fa-file:before {\r\n    content: \"\\F15B\"\r\n}\r\n\r\n.fa-file-text:before {\r\n    content: \"\\F15C\"\r\n}\r\n\r\n.fa-sort-alpha-asc:before {\r\n    content: \"\\F15D\"\r\n}\r\n\r\n.fa-sort-alpha-desc:before {\r\n    content: \"\\F15E\"\r\n}\r\n\r\n.fa-sort-amount-asc:before {\r\n    content: \"\\F160\"\r\n}\r\n\r\n.fa-sort-amount-desc:before {\r\n    content: \"\\F161\"\r\n}\r\n\r\n.fa-sort-numeric-asc:before {\r\n    content: \"\\F162\"\r\n}\r\n\r\n.fa-sort-numeric-desc:before {\r\n    content: \"\\F163\"\r\n}\r\n\r\n.fa-thumbs-up:before {\r\n    content: \"\\F164\"\r\n}\r\n\r\n.fa-thumbs-down:before {\r\n    content: \"\\F165\"\r\n}\r\n\r\n.fa-youtube-square:before {\r\n    content: \"\\F166\"\r\n}\r\n\r\n.fa-youtube:before {\r\n    content: \"\\F167\"\r\n}\r\n\r\n.fa-xing:before {\r\n    content: \"\\F168\"\r\n}\r\n\r\n.fa-xing-square:before {\r\n    content: \"\\F169\"\r\n}\r\n\r\n.fa-youtube-play:before {\r\n    content: \"\\F16A\"\r\n}\r\n\r\n.fa-dropbox:before {\r\n    content: \"\\F16B\"\r\n}\r\n\r\n.fa-stack-overflow:before {\r\n    content: \"\\F16C\"\r\n}\r\n\r\n.fa-instagram:before {\r\n    content: \"\\F16D\"\r\n}\r\n\r\n.fa-flickr:before {\r\n    content: \"\\F16E\"\r\n}\r\n\r\n.fa-adn:before {\r\n    content: \"\\F170\"\r\n}\r\n\r\n.fa-bitbucket:before {\r\n    content: \"\\F171\"\r\n}\r\n\r\n.fa-bitbucket-square:before {\r\n    content: \"\\F172\"\r\n}\r\n\r\n.fa-tumblr:before {\r\n    content: \"\\F173\"\r\n}\r\n\r\n.fa-tumblr-square:before {\r\n    content: \"\\F174\"\r\n}\r\n\r\n.fa-long-arrow-down:before {\r\n    content: \"\\F175\"\r\n}\r\n\r\n.fa-long-arrow-up:before {\r\n    content: \"\\F176\"\r\n}\r\n\r\n.fa-long-arrow-left:before {\r\n    content: \"\\F177\"\r\n}\r\n\r\n.fa-long-arrow-right:before {\r\n    content: \"\\F178\"\r\n}\r\n\r\n.fa-apple:before {\r\n    content: \"\\F179\"\r\n}\r\n\r\n.fa-windows:before {\r\n    content: \"\\F17A\"\r\n}\r\n\r\n.fa-android:before {\r\n    content: \"\\F17B\"\r\n}\r\n\r\n.fa-linux:before {\r\n    content: \"\\F17C\"\r\n}\r\n\r\n.fa-dribbble:before {\r\n    content: \"\\F17D\"\r\n}\r\n\r\n.fa-skype:before {\r\n    content: \"\\F17E\"\r\n}\r\n\r\n.fa-foursquare:before {\r\n    content: \"\\F180\"\r\n}\r\n\r\n.fa-trello:before {\r\n    content: \"\\F181\"\r\n}\r\n\r\n.fa-female:before {\r\n    content: \"\\F182\"\r\n}\r\n\r\n.fa-male:before {\r\n    content: \"\\F183\"\r\n}\r\n\r\n.fa-gittip:before, .fa-gratipay:before {\r\n    content: \"\\F184\"\r\n}\r\n\r\n.fa-sun-o:before {\r\n    content: \"\\F185\"\r\n}\r\n\r\n.fa-moon-o:before {\r\n    content: \"\\F186\"\r\n}\r\n\r\n.fa-archive:before {\r\n    content: \"\\F187\"\r\n}\r\n\r\n.fa-bug:before {\r\n    content: \"\\F188\"\r\n}\r\n\r\n.fa-vk:before {\r\n    content: \"\\F189\"\r\n}\r\n\r\n.fa-weibo:before {\r\n    content: \"\\F18A\"\r\n}\r\n\r\n.fa-renren:before {\r\n    content: \"\\F18B\"\r\n}\r\n\r\n.fa-pagelines:before {\r\n    content: \"\\F18C\"\r\n}\r\n\r\n.fa-stack-exchange:before {\r\n    content: \"\\F18D\"\r\n}\r\n\r\n.fa-arrow-circle-o-right:before {\r\n    content: \"\\F18E\"\r\n}\r\n\r\n.fa-arrow-circle-o-left:before {\r\n    content: \"\\F190\"\r\n}\r\n\r\n.fa-toggle-left:before, .fa-caret-square-o-left:before {\r\n    content: \"\\F191\"\r\n}\r\n\r\n.fa-dot-circle-o:before {\r\n    content: \"\\F192\"\r\n}\r\n\r\n.fa-wheelchair:before {\r\n    content: \"\\F193\"\r\n}\r\n\r\n.fa-vimeo-square:before {\r\n    content: \"\\F194\"\r\n}\r\n\r\n.fa-turkish-lira:before, .fa-try:before {\r\n    content: \"\\F195\"\r\n}\r\n\r\n.fa-plus-square-o:before {\r\n    content: \"\\F196\"\r\n}\r\n\r\n.fa-space-shuttle:before {\r\n    content: \"\\F197\"\r\n}\r\n\r\n.fa-slack:before {\r\n    content: \"\\F198\"\r\n}\r\n\r\n.fa-envelope-square:before {\r\n    content: \"\\F199\"\r\n}\r\n\r\n.fa-wordpress:before {\r\n    content: \"\\F19A\"\r\n}\r\n\r\n.fa-openid:before {\r\n    content: \"\\F19B\"\r\n}\r\n\r\n.fa-institution:before, .fa-bank:before, .fa-university:before {\r\n    content: \"\\F19C\"\r\n}\r\n\r\n.fa-mortar-board:before, .fa-graduation-cap:before {\r\n    content: \"\\F19D\"\r\n}\r\n\r\n.fa-yahoo:before {\r\n    content: \"\\F19E\"\r\n}\r\n\r\n.fa-google:before {\r\n    content: \"\\F1A0\"\r\n}\r\n\r\n.fa-reddit:before {\r\n    content: \"\\F1A1\"\r\n}\r\n\r\n.fa-reddit-square:before {\r\n    content: \"\\F1A2\"\r\n}\r\n\r\n.fa-stumbleupon-circle:before {\r\n    content: \"\\F1A3\"\r\n}\r\n\r\n.fa-stumbleupon:before {\r\n    content: \"\\F1A4\"\r\n}\r\n\r\n.fa-delicious:before {\r\n    content: \"\\F1A5\"\r\n}\r\n\r\n.fa-digg:before {\r\n    content: \"\\F1A6\"\r\n}\r\n\r\n.fa-pied-piper-pp:before {\r\n    content: \"\\F1A7\"\r\n}\r\n\r\n.fa-pied-piper-alt:before {\r\n    content: \"\\F1A8\"\r\n}\r\n\r\n.fa-drupal:before {\r\n    content: \"\\F1A9\"\r\n}\r\n\r\n.fa-joomla:before {\r\n    content: \"\\F1AA\"\r\n}\r\n\r\n.fa-language:before {\r\n    content: \"\\F1AB\"\r\n}\r\n\r\n.fa-fax:before {\r\n    content: \"\\F1AC\"\r\n}\r\n\r\n.fa-building:before {\r\n    content: \"\\F1AD\"\r\n}\r\n\r\n.fa-child:before {\r\n    content: \"\\F1AE\"\r\n}\r\n\r\n.fa-paw:before {\r\n    content: \"\\F1B0\"\r\n}\r\n\r\n.fa-spoon:before {\r\n    content: \"\\F1B1\"\r\n}\r\n\r\n.fa-cube:before {\r\n    content: \"\\F1B2\"\r\n}\r\n\r\n.fa-cubes:before {\r\n    content: \"\\F1B3\"\r\n}\r\n\r\n.fa-behance:before {\r\n    content: \"\\F1B4\"\r\n}\r\n\r\n.fa-behance-square:before {\r\n    content: \"\\F1B5\"\r\n}\r\n\r\n.fa-steam:before {\r\n    content: \"\\F1B6\"\r\n}\r\n\r\n.fa-steam-square:before {\r\n    content: \"\\F1B7\"\r\n}\r\n\r\n.fa-recycle:before {\r\n    content: \"\\F1B8\"\r\n}\r\n\r\n.fa-automobile:before, .fa-car:before {\r\n    content: \"\\F1B9\"\r\n}\r\n\r\n.fa-cab:before, .fa-taxi:before {\r\n    content: \"\\F1BA\"\r\n}\r\n\r\n.fa-tree:before {\r\n    content: \"\\F1BB\"\r\n}\r\n\r\n.fa-spotify:before {\r\n    content: \"\\F1BC\"\r\n}\r\n\r\n.fa-deviantart:before {\r\n    content: \"\\F1BD\"\r\n}\r\n\r\n.fa-soundcloud:before {\r\n    content: \"\\F1BE\"\r\n}\r\n\r\n.fa-database:before {\r\n    content: \"\\F1C0\"\r\n}\r\n\r\n.fa-file-pdf-o:before {\r\n    content: \"\\F1C1\"\r\n}\r\n\r\n.fa-file-word-o:before {\r\n    content: \"\\F1C2\"\r\n}\r\n\r\n.fa-file-excel-o:before {\r\n    content: \"\\F1C3\"\r\n}\r\n\r\n.fa-file-powerpoint-o:before {\r\n    content: \"\\F1C4\"\r\n}\r\n\r\n.fa-file-photo-o:before, .fa-file-picture-o:before, .fa-file-image-o:before {\r\n    content: \"\\F1C5\"\r\n}\r\n\r\n.fa-file-zip-o:before, .fa-file-archive-o:before {\r\n    content: \"\\F1C6\"\r\n}\r\n\r\n.fa-file-sound-o:before, .fa-file-audio-o:before {\r\n    content: \"\\F1C7\"\r\n}\r\n\r\n.fa-file-movie-o:before, .fa-file-video-o:before {\r\n    content: \"\\F1C8\"\r\n}\r\n\r\n.fa-file-code-o:before {\r\n    content: \"\\F1C9\"\r\n}\r\n\r\n.fa-vine:before {\r\n    content: \"\\F1CA\"\r\n}\r\n\r\n.fa-codepen:before {\r\n    content: \"\\F1CB\"\r\n}\r\n\r\n.fa-jsfiddle:before {\r\n    content: \"\\F1CC\"\r\n}\r\n\r\n.fa-life-bouy:before, .fa-life-buoy:before, .fa-life-saver:before, .fa-support:before, .fa-life-ring:before {\r\n    content: \"\\F1CD\"\r\n}\r\n\r\n.fa-circle-o-notch:before {\r\n    content: \"\\F1CE\"\r\n}\r\n\r\n.fa-ra:before, .fa-resistance:before, .fa-rebel:before {\r\n    content: \"\\F1D0\"\r\n}\r\n\r\n.fa-ge:before, .fa-empire:before {\r\n    content: \"\\F1D1\"\r\n}\r\n\r\n.fa-git-square:before {\r\n    content: \"\\F1D2\"\r\n}\r\n\r\n.fa-git:before {\r\n    content: \"\\F1D3\"\r\n}\r\n\r\n.fa-y-combinator-square:before, .fa-yc-square:before, .fa-hacker-news:before {\r\n    content: \"\\F1D4\"\r\n}\r\n\r\n.fa-tencent-weibo:before {\r\n    content: \"\\F1D5\"\r\n}\r\n\r\n.fa-qq:before {\r\n    content: \"\\F1D6\"\r\n}\r\n\r\n.fa-wechat:before, .fa-weixin:before {\r\n    content: \"\\F1D7\"\r\n}\r\n\r\n.fa-send:before, .fa-paper-plane:before {\r\n    content: \"\\F1D8\"\r\n}\r\n\r\n.fa-send-o:before, .fa-paper-plane-o:before {\r\n    content: \"\\F1D9\"\r\n}\r\n\r\n.fa-history:before {\r\n    content: \"\\F1DA\"\r\n}\r\n\r\n.fa-circle-thin:before {\r\n    content: \"\\F1DB\"\r\n}\r\n\r\n.fa-header:before {\r\n    content: \"\\F1DC\"\r\n}\r\n\r\n.fa-paragraph:before {\r\n    content: \"\\F1DD\"\r\n}\r\n\r\n.fa-sliders:before {\r\n    content: \"\\F1DE\"\r\n}\r\n\r\n.fa-share-alt:before {\r\n    content: \"\\F1E0\"\r\n}\r\n\r\n.fa-share-alt-square:before {\r\n    content: \"\\F1E1\"\r\n}\r\n\r\n.fa-bomb:before {\r\n    content: \"\\F1E2\"\r\n}\r\n\r\n.fa-soccer-ball-o:before, .fa-futbol-o:before {\r\n    content: \"\\F1E3\"\r\n}\r\n\r\n.fa-tty:before {\r\n    content: \"\\F1E4\"\r\n}\r\n\r\n.fa-binoculars:before {\r\n    content: \"\\F1E5\"\r\n}\r\n\r\n.fa-plug:before {\r\n    content: \"\\F1E6\"\r\n}\r\n\r\n.fa-slideshare:before {\r\n    content: \"\\F1E7\"\r\n}\r\n\r\n.fa-twitch:before {\r\n    content: \"\\F1E8\"\r\n}\r\n\r\n.fa-yelp:before {\r\n    content: \"\\F1E9\"\r\n}\r\n\r\n.fa-newspaper-o:before {\r\n    content: \"\\F1EA\"\r\n}\r\n\r\n.fa-wifi:before {\r\n    content: \"\\F1EB\"\r\n}\r\n\r\n.fa-calculator:before {\r\n    content: \"\\F1EC\"\r\n}\r\n\r\n.fa-paypal:before {\r\n    content: \"\\F1ED\"\r\n}\r\n\r\n.fa-google-wallet:before {\r\n    content: \"\\F1EE\"\r\n}\r\n\r\n.fa-cc-visa:before {\r\n    content: \"\\F1F0\"\r\n}\r\n\r\n.fa-cc-mastercard:before {\r\n    content: \"\\F1F1\"\r\n}\r\n\r\n.fa-cc-discover:before {\r\n    content: \"\\F1F2\"\r\n}\r\n\r\n.fa-cc-amex:before {\r\n    content: \"\\F1F3\"\r\n}\r\n\r\n.fa-cc-paypal:before {\r\n    content: \"\\F1F4\"\r\n}\r\n\r\n.fa-cc-stripe:before {\r\n    content: \"\\F1F5\"\r\n}\r\n\r\n.fa-bell-slash:before {\r\n    content: \"\\F1F6\"\r\n}\r\n\r\n.fa-bell-slash-o:before {\r\n    content: \"\\F1F7\"\r\n}\r\n\r\n.fa-trash:before {\r\n    content: \"\\F1F8\"\r\n}\r\n\r\n.fa-copyright:before {\r\n    content: \"\\F1F9\"\r\n}\r\n\r\n.fa-at:before {\r\n    content: \"\\F1FA\"\r\n}\r\n\r\n.fa-eyedropper:before {\r\n    content: \"\\F1FB\"\r\n}\r\n\r\n.fa-paint-brush:before {\r\n    content: \"\\F1FC\"\r\n}\r\n\r\n.fa-birthday-cake:before {\r\n    content: \"\\F1FD\"\r\n}\r\n\r\n.fa-area-chart:before {\r\n    content: \"\\F1FE\"\r\n}\r\n\r\n.fa-pie-chart:before {\r\n    content: \"\\F200\"\r\n}\r\n\r\n.fa-line-chart:before {\r\n    content: \"\\F201\"\r\n}\r\n\r\n.fa-lastfm:before {\r\n    content: \"\\F202\"\r\n}\r\n\r\n.fa-lastfm-square:before {\r\n    content: \"\\F203\"\r\n}\r\n\r\n.fa-toggle-off:before {\r\n    content: \"\\F204\"\r\n}\r\n\r\n.fa-toggle-on:before {\r\n    content: \"\\F205\"\r\n}\r\n\r\n.fa-bicycle:before {\r\n    content: \"\\F206\"\r\n}\r\n\r\n.fa-bus:before {\r\n    content: \"\\F207\"\r\n}\r\n\r\n.fa-ioxhost:before {\r\n    content: \"\\F208\"\r\n}\r\n\r\n.fa-angellist:before {\r\n    content: \"\\F209\"\r\n}\r\n\r\n.fa-cc:before {\r\n    content: \"\\F20A\"\r\n}\r\n\r\n.fa-shekel:before, .fa-sheqel:before, .fa-ils:before {\r\n    content: \"\\F20B\"\r\n}\r\n\r\n.fa-meanpath:before {\r\n    content: \"\\F20C\"\r\n}\r\n\r\n.fa-buysellads:before {\r\n    content: \"\\F20D\"\r\n}\r\n\r\n.fa-connectdevelop:before {\r\n    content: \"\\F20E\"\r\n}\r\n\r\n.fa-dashcube:before {\r\n    content: \"\\F210\"\r\n}\r\n\r\n.fa-forumbee:before {\r\n    content: \"\\F211\"\r\n}\r\n\r\n.fa-leanpub:before {\r\n    content: \"\\F212\"\r\n}\r\n\r\n.fa-sellsy:before {\r\n    content: \"\\F213\"\r\n}\r\n\r\n.fa-shirtsinbulk:before {\r\n    content: \"\\F214\"\r\n}\r\n\r\n.fa-simplybuilt:before {\r\n    content: \"\\F215\"\r\n}\r\n\r\n.fa-skyatlas:before {\r\n    content: \"\\F216\"\r\n}\r\n\r\n.fa-cart-plus:before {\r\n    content: \"\\F217\"\r\n}\r\n\r\n.fa-cart-arrow-down:before {\r\n    content: \"\\F218\"\r\n}\r\n\r\n.fa-diamond:before {\r\n    content: \"\\F219\"\r\n}\r\n\r\n.fa-ship:before {\r\n    content: \"\\F21A\"\r\n}\r\n\r\n.fa-user-secret:before {\r\n    content: \"\\F21B\"\r\n}\r\n\r\n.fa-motorcycle:before {\r\n    content: \"\\F21C\"\r\n}\r\n\r\n.fa-street-view:before {\r\n    content: \"\\F21D\"\r\n}\r\n\r\n.fa-heartbeat:before {\r\n    content: \"\\F21E\"\r\n}\r\n\r\n.fa-venus:before {\r\n    content: \"\\F221\"\r\n}\r\n\r\n.fa-mars:before {\r\n    content: \"\\F222\"\r\n}\r\n\r\n.fa-mercury:before {\r\n    content: \"\\F223\"\r\n}\r\n\r\n.fa-intersex:before, .fa-transgender:before {\r\n    content: \"\\F224\"\r\n}\r\n\r\n.fa-transgender-alt:before {\r\n    content: \"\\F225\"\r\n}\r\n\r\n.fa-venus-double:before {\r\n    content: \"\\F226\"\r\n}\r\n\r\n.fa-mars-double:before {\r\n    content: \"\\F227\"\r\n}\r\n\r\n.fa-venus-mars:before {\r\n    content: \"\\F228\"\r\n}\r\n\r\n.fa-mars-stroke:before {\r\n    content: \"\\F229\"\r\n}\r\n\r\n.fa-mars-stroke-v:before {\r\n    content: \"\\F22A\"\r\n}\r\n\r\n.fa-mars-stroke-h:before {\r\n    content: \"\\F22B\"\r\n}\r\n\r\n.fa-neuter:before {\r\n    content: \"\\F22C\"\r\n}\r\n\r\n.fa-genderless:before {\r\n    content: \"\\F22D\"\r\n}\r\n\r\n.fa-facebook-official:before {\r\n    content: \"\\F230\"\r\n}\r\n\r\n.fa-pinterest-p:before {\r\n    content: \"\\F231\"\r\n}\r\n\r\n.fa-whatsapp:before {\r\n    content: \"\\F232\"\r\n}\r\n\r\n.fa-server:before {\r\n    content: \"\\F233\"\r\n}\r\n\r\n.fa-user-plus:before {\r\n    content: \"\\F234\"\r\n}\r\n\r\n.fa-user-times:before {\r\n    content: \"\\F235\"\r\n}\r\n\r\n.fa-hotel:before, .fa-bed:before {\r\n    content: \"\\F236\"\r\n}\r\n\r\n.fa-viacoin:before {\r\n    content: \"\\F237\"\r\n}\r\n\r\n.fa-train:before {\r\n    content: \"\\F238\"\r\n}\r\n\r\n.fa-subway:before {\r\n    content: \"\\F239\"\r\n}\r\n\r\n.fa-medium:before {\r\n    content: \"\\F23A\"\r\n}\r\n\r\n.fa-yc:before, .fa-y-combinator:before {\r\n    content: \"\\F23B\"\r\n}\r\n\r\n.fa-optin-monster:before {\r\n    content: \"\\F23C\"\r\n}\r\n\r\n.fa-opencart:before {\r\n    content: \"\\F23D\"\r\n}\r\n\r\n.fa-expeditedssl:before {\r\n    content: \"\\F23E\"\r\n}\r\n\r\n.fa-battery-4:before, .fa-battery:before, .fa-battery-full:before {\r\n    content: \"\\F240\"\r\n}\r\n\r\n.fa-battery-3:before, .fa-battery-three-quarters:before {\r\n    content: \"\\F241\"\r\n}\r\n\r\n.fa-battery-2:before, .fa-battery-half:before {\r\n    content: \"\\F242\"\r\n}\r\n\r\n.fa-battery-1:before, .fa-battery-quarter:before {\r\n    content: \"\\F243\"\r\n}\r\n\r\n.fa-battery-0:before, .fa-battery-empty:before {\r\n    content: \"\\F244\"\r\n}\r\n\r\n.fa-mouse-pointer:before {\r\n    content: \"\\F245\"\r\n}\r\n\r\n.fa-i-cursor:before {\r\n    content: \"\\F246\"\r\n}\r\n\r\n.fa-object-group:before {\r\n    content: \"\\F247\"\r\n}\r\n\r\n.fa-object-ungroup:before {\r\n    content: \"\\F248\"\r\n}\r\n\r\n.fa-sticky-note:before {\r\n    content: \"\\F249\"\r\n}\r\n\r\n.fa-sticky-note-o:before {\r\n    content: \"\\F24A\"\r\n}\r\n\r\n.fa-cc-jcb:before {\r\n    content: \"\\F24B\"\r\n}\r\n\r\n.fa-cc-diners-club:before {\r\n    content: \"\\F24C\"\r\n}\r\n\r\n.fa-clone:before {\r\n    content: \"\\F24D\"\r\n}\r\n\r\n.fa-balance-scale:before {\r\n    content: \"\\F24E\"\r\n}\r\n\r\n.fa-hourglass-o:before {\r\n    content: \"\\F250\"\r\n}\r\n\r\n.fa-hourglass-1:before, .fa-hourglass-start:before {\r\n    content: \"\\F251\"\r\n}\r\n\r\n.fa-hourglass-2:before, .fa-hourglass-half:before {\r\n    content: \"\\F252\"\r\n}\r\n\r\n.fa-hourglass-3:before, .fa-hourglass-end:before {\r\n    content: \"\\F253\"\r\n}\r\n\r\n.fa-hourglass:before {\r\n    content: \"\\F254\"\r\n}\r\n\r\n.fa-hand-grab-o:before, .fa-hand-rock-o:before {\r\n    content: \"\\F255\"\r\n}\r\n\r\n.fa-hand-stop-o:before, .fa-hand-paper-o:before {\r\n    content: \"\\F256\"\r\n}\r\n\r\n.fa-hand-scissors-o:before {\r\n    content: \"\\F257\"\r\n}\r\n\r\n.fa-hand-lizard-o:before {\r\n    content: \"\\F258\"\r\n}\r\n\r\n.fa-hand-spock-o:before {\r\n    content: \"\\F259\"\r\n}\r\n\r\n.fa-hand-pointer-o:before {\r\n    content: \"\\F25A\"\r\n}\r\n\r\n.fa-hand-peace-o:before {\r\n    content: \"\\F25B\"\r\n}\r\n\r\n.fa-trademark:before {\r\n    content: \"\\F25C\"\r\n}\r\n\r\n.fa-registered:before {\r\n    content: \"\\F25D\"\r\n}\r\n\r\n.fa-creative-commons:before {\r\n    content: \"\\F25E\"\r\n}\r\n\r\n.fa-gg:before {\r\n    content: \"\\F260\"\r\n}\r\n\r\n.fa-gg-circle:before {\r\n    content: \"\\F261\"\r\n}\r\n\r\n.fa-tripadvisor:before {\r\n    content: \"\\F262\"\r\n}\r\n\r\n.fa-odnoklassniki:before {\r\n    content: \"\\F263\"\r\n}\r\n\r\n.fa-odnoklassniki-square:before {\r\n    content: \"\\F264\"\r\n}\r\n\r\n.fa-get-pocket:before {\r\n    content: \"\\F265\"\r\n}\r\n\r\n.fa-wikipedia-w:before {\r\n    content: \"\\F266\"\r\n}\r\n\r\n.fa-safari:before {\r\n    content: \"\\F267\"\r\n}\r\n\r\n.fa-chrome:before {\r\n    content: \"\\F268\"\r\n}\r\n\r\n.fa-firefox:before {\r\n    content: \"\\F269\"\r\n}\r\n\r\n.fa-opera:before {\r\n    content: \"\\F26A\"\r\n}\r\n\r\n.fa-internet-explorer:before {\r\n    content: \"\\F26B\"\r\n}\r\n\r\n.fa-tv:before, .fa-television:before {\r\n    content: \"\\F26C\"\r\n}\r\n\r\n.fa-contao:before {\r\n    content: \"\\F26D\"\r\n}\r\n\r\n.fa-500px:before {\r\n    content: \"\\F26E\"\r\n}\r\n\r\n.fa-amazon:before {\r\n    content: \"\\F270\"\r\n}\r\n\r\n.fa-calendar-plus-o:before {\r\n    content: \"\\F271\"\r\n}\r\n\r\n.fa-calendar-minus-o:before {\r\n    content: \"\\F272\"\r\n}\r\n\r\n.fa-calendar-times-o:before {\r\n    content: \"\\F273\"\r\n}\r\n\r\n.fa-calendar-check-o:before {\r\n    content: \"\\F274\"\r\n}\r\n\r\n.fa-industry:before {\r\n    content: \"\\F275\"\r\n}\r\n\r\n.fa-map-pin:before {\r\n    content: \"\\F276\"\r\n}\r\n\r\n.fa-map-signs:before {\r\n    content: \"\\F277\"\r\n}\r\n\r\n.fa-map-o:before {\r\n    content: \"\\F278\"\r\n}\r\n\r\n.fa-map:before {\r\n    content: \"\\F279\"\r\n}\r\n\r\n.fa-commenting:before {\r\n    content: \"\\F27A\"\r\n}\r\n\r\n.fa-commenting-o:before {\r\n    content: \"\\F27B\"\r\n}\r\n\r\n.fa-houzz:before {\r\n    content: \"\\F27C\"\r\n}\r\n\r\n.fa-vimeo:before {\r\n    content: \"\\F27D\"\r\n}\r\n\r\n.fa-black-tie:before {\r\n    content: \"\\F27E\"\r\n}\r\n\r\n.fa-fonticons:before {\r\n    content: \"\\F280\"\r\n}\r\n\r\n.fa-reddit-alien:before {\r\n    content: \"\\F281\"\r\n}\r\n\r\n.fa-edge:before {\r\n    content: \"\\F282\"\r\n}\r\n\r\n.fa-credit-card-alt:before {\r\n    content: \"\\F283\"\r\n}\r\n\r\n.fa-codiepie:before {\r\n    content: \"\\F284\"\r\n}\r\n\r\n.fa-modx:before {\r\n    content: \"\\F285\"\r\n}\r\n\r\n.fa-fort-awesome:before {\r\n    content: \"\\F286\"\r\n}\r\n\r\n.fa-usb:before {\r\n    content: \"\\F287\"\r\n}\r\n\r\n.fa-product-hunt:before {\r\n    content: \"\\F288\"\r\n}\r\n\r\n.fa-mixcloud:before {\r\n    content: \"\\F289\"\r\n}\r\n\r\n.fa-scribd:before {\r\n    content: \"\\F28A\"\r\n}\r\n\r\n.fa-pause-circle:before {\r\n    content: \"\\F28B\"\r\n}\r\n\r\n.fa-pause-circle-o:before {\r\n    content: \"\\F28C\"\r\n}\r\n\r\n.fa-stop-circle:before {\r\n    content: \"\\F28D\"\r\n}\r\n\r\n.fa-stop-circle-o:before {\r\n    content: \"\\F28E\"\r\n}\r\n\r\n.fa-shopping-bag:before {\r\n    content: \"\\F290\"\r\n}\r\n\r\n.fa-shopping-basket:before {\r\n    content: \"\\F291\"\r\n}\r\n\r\n.fa-hashtag:before {\r\n    content: \"\\F292\"\r\n}\r\n\r\n.fa-bluetooth:before {\r\n    content: \"\\F293\"\r\n}\r\n\r\n.fa-bluetooth-b:before {\r\n    content: \"\\F294\"\r\n}\r\n\r\n.fa-percent:before {\r\n    content: \"\\F295\"\r\n}\r\n\r\n.fa-gitlab:before {\r\n    content: \"\\F296\"\r\n}\r\n\r\n.fa-wpbeginner:before {\r\n    content: \"\\F297\"\r\n}\r\n\r\n.fa-wpforms:before {\r\n    content: \"\\F298\"\r\n}\r\n\r\n.fa-envira:before {\r\n    content: \"\\F299\"\r\n}\r\n\r\n.fa-universal-access:before {\r\n    content: \"\\F29A\"\r\n}\r\n\r\n.fa-wheelchair-alt:before {\r\n    content: \"\\F29B\"\r\n}\r\n\r\n.fa-question-circle-o:before {\r\n    content: \"\\F29C\"\r\n}\r\n\r\n.fa-blind:before {\r\n    content: \"\\F29D\"\r\n}\r\n\r\n.fa-audio-description:before {\r\n    content: \"\\F29E\"\r\n}\r\n\r\n.fa-volume-control-phone:before {\r\n    content: \"\\F2A0\"\r\n}\r\n\r\n.fa-braille:before {\r\n    content: \"\\F2A1\"\r\n}\r\n\r\n.fa-assistive-listening-systems:before {\r\n    content: \"\\F2A2\"\r\n}\r\n\r\n.fa-asl-interpreting:before, .fa-american-sign-language-interpreting:before {\r\n    content: \"\\F2A3\"\r\n}\r\n\r\n.fa-deafness:before, .fa-hard-of-hearing:before, .fa-deaf:before {\r\n    content: \"\\F2A4\"\r\n}\r\n\r\n.fa-glide:before {\r\n    content: \"\\F2A5\"\r\n}\r\n\r\n.fa-glide-g:before {\r\n    content: \"\\F2A6\"\r\n}\r\n\r\n.fa-signing:before, .fa-sign-language:before {\r\n    content: \"\\F2A7\"\r\n}\r\n\r\n.fa-low-vision:before {\r\n    content: \"\\F2A8\"\r\n}\r\n\r\n.fa-viadeo:before {\r\n    content: \"\\F2A9\"\r\n}\r\n\r\n.fa-viadeo-square:before {\r\n    content: \"\\F2AA\"\r\n}\r\n\r\n.fa-snapchat:before {\r\n    content: \"\\F2AB\"\r\n}\r\n\r\n.fa-snapchat-ghost:before {\r\n    content: \"\\F2AC\"\r\n}\r\n\r\n.fa-snapchat-square:before {\r\n    content: \"\\F2AD\"\r\n}\r\n\r\n.fa-pied-piper:before {\r\n    content: \"\\F2AE\"\r\n}\r\n\r\n.fa-first-order:before {\r\n    content: \"\\F2B0\"\r\n}\r\n\r\n.fa-yoast:before {\r\n    content: \"\\F2B1\"\r\n}\r\n\r\n.fa-themeisle:before {\r\n    content: \"\\F2B2\"\r\n}\r\n\r\n.fa-google-plus-circle:before, .fa-google-plus-official:before {\r\n    content: \"\\F2B3\"\r\n}\r\n\r\n.fa-fa:before, .fa-font-awesome:before {\r\n    content: \"\\F2B4\"\r\n}\r\n\r\n.fa-handshake-o:before {\r\n    content: \"\\F2B5\"\r\n}\r\n\r\n.fa-envelope-open:before {\r\n    content: \"\\F2B6\"\r\n}\r\n\r\n.fa-envelope-open-o:before {\r\n    content: \"\\F2B7\"\r\n}\r\n\r\n.fa-linode:before {\r\n    content: \"\\F2B8\"\r\n}\r\n\r\n.fa-address-book:before {\r\n    content: \"\\F2B9\"\r\n}\r\n\r\n.fa-address-book-o:before {\r\n    content: \"\\F2BA\"\r\n}\r\n\r\n.fa-vcard:before, .fa-address-card:before {\r\n    content: \"\\F2BB\"\r\n}\r\n\r\n.fa-vcard-o:before, .fa-address-card-o:before {\r\n    content: \"\\F2BC\"\r\n}\r\n\r\n.fa-user-circle:before {\r\n    content: \"\\F2BD\"\r\n}\r\n\r\n.fa-user-circle-o:before {\r\n    content: \"\\F2BE\"\r\n}\r\n\r\n.fa-user-o:before {\r\n    content: \"\\F2C0\"\r\n}\r\n\r\n.fa-id-badge:before {\r\n    content: \"\\F2C1\"\r\n}\r\n\r\n.fa-drivers-license:before, .fa-id-card:before {\r\n    content: \"\\F2C2\"\r\n}\r\n\r\n.fa-drivers-license-o:before, .fa-id-card-o:before {\r\n    content: \"\\F2C3\"\r\n}\r\n\r\n.fa-quora:before {\r\n    content: \"\\F2C4\"\r\n}\r\n\r\n.fa-free-code-camp:before {\r\n    content: \"\\F2C5\"\r\n}\r\n\r\n.fa-telegram:before {\r\n    content: \"\\F2C6\"\r\n}\r\n\r\n.fa-thermometer-4:before, .fa-thermometer:before, .fa-thermometer-full:before {\r\n    content: \"\\F2C7\"\r\n}\r\n\r\n.fa-thermometer-3:before, .fa-thermometer-three-quarters:before {\r\n    content: \"\\F2C8\"\r\n}\r\n\r\n.fa-thermometer-2:before, .fa-thermometer-half:before {\r\n    content: \"\\F2C9\"\r\n}\r\n\r\n.fa-thermometer-1:before, .fa-thermometer-quarter:before {\r\n    content: \"\\F2CA\"\r\n}\r\n\r\n.fa-thermometer-0:before, .fa-thermometer-empty:before {\r\n    content: \"\\F2CB\"\r\n}\r\n\r\n.fa-shower:before {\r\n    content: \"\\F2CC\"\r\n}\r\n\r\n.fa-bathtub:before, .fa-s15:before, .fa-bath:before {\r\n    content: \"\\F2CD\"\r\n}\r\n\r\n.fa-podcast:before {\r\n    content: \"\\F2CE\"\r\n}\r\n\r\n.fa-window-maximize:before {\r\n    content: \"\\F2D0\"\r\n}\r\n\r\n.fa-window-minimize:before {\r\n    content: \"\\F2D1\"\r\n}\r\n\r\n.fa-window-restore:before {\r\n    content: \"\\F2D2\"\r\n}\r\n\r\n.fa-times-rectangle:before, .fa-window-close:before {\r\n    content: \"\\F2D3\"\r\n}\r\n\r\n.fa-times-rectangle-o:before, .fa-window-close-o:before {\r\n    content: \"\\F2D4\"\r\n}\r\n\r\n.fa-bandcamp:before {\r\n    content: \"\\F2D5\"\r\n}\r\n\r\n.fa-grav:before {\r\n    content: \"\\F2D6\"\r\n}\r\n\r\n.fa-etsy:before {\r\n    content: \"\\F2D7\"\r\n}\r\n\r\n.fa-imdb:before {\r\n    content: \"\\F2D8\"\r\n}\r\n\r\n.fa-ravelry:before {\r\n    content: \"\\F2D9\"\r\n}\r\n\r\n.fa-eercast:before {\r\n    content: \"\\F2DA\"\r\n}\r\n\r\n.fa-microchip:before {\r\n    content: \"\\F2DB\"\r\n}\r\n\r\n.fa-snowflake-o:before {\r\n    content: \"\\F2DC\"\r\n}\r\n\r\n.fa-superpowers:before {\r\n    content: \"\\F2DD\"\r\n}\r\n\r\n.fa-wpexplorer:before {\r\n    content: \"\\F2DE\"\r\n}\r\n\r\n.fa-meetup:before {\r\n    content: \"\\F2E0\"\r\n}\r\n\r\n.sr-only {\r\n    position: absolute;\r\n    width: 1px;\r\n    height: 1px;\r\n    padding: 0;\r\n    margin: -1px;\r\n    overflow: hidden;\r\n    clip: rect(0, 0, 0, 0);\r\n    border: 0\r\n}\r\n\r\n.sr-only-focusable:active, .sr-only-focusable:focus {\r\n    position: static;\r\n    width: auto;\r\n    height: auto;\r\n    margin: 0;\r\n    overflow: visible;\r\n    clip: auto\r\n}\r\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Poppins:400,400i,600,600i,700,700i);", ""]);
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Raleway:300,300i,400,400i,600,600i,700,700i);", ""]);

// module
exports.push([module.i, "/*\r\n* ilham - Multi-purpose HTML Template\r\n* Build Date: January 2018\r\n* Author: ThemeAtelier\r\n* Copyright (C) 2017 ThemeAtelier\r\n*/\r\n\r\n/* TABLE OF CONTENTS\r\n/* -------------------------------------\r\n    1. IMPORT GOOGLE FONTS\r\n    2. GENERAL\r\n    3. HEADAER\r\n    3. SLIDER\r\n    4. WHAT WE DO / FEATURED SECTION\r\n    5. SERVICES V2\r\n    6. WHAT WE DO / FEATURED SECTION 2\r\n    7. TEAM MEMBERS\r\n\t8. PORTFOLIOS\r\n\t9. CALL TO ACTION \r\n\t10. TESTIMONIALS\r\n\t11. HOW WE WORK\r\n\t12. PRICING TABLES\r\n\t13. FUN FACTS\r\n\t14. OUR CLIENTS\r\n\t15. LATEST POSTS\r\n\t16. TIMELINE POSTS\r\n\t17. TIMELINE EDUCATION AND EXPIREANCE\r\n\t18. CONTACT SECTION\r\n\t19. TABS\r\n\t20. PROGRESS BARS\r\n\t21. SINGLE BLOG\r\n\t22. ABOUT PAGE\r\n\t23. CONTACT PAGES\r\n\t24. 404 PAGES\r\n\t25. COMING SOON PAGES\r\n\t26. FOOTER\r\n\t------------------------------------- */\r\n\r\n/*  ----------------------------------------------------\r\n1. IMPORT GOOGLE FONTS\r\n-------------------------------------------------------- */\r\n/* Body font */\r\n/* Heading font */ /* Body font */\r\n\r\n/*  ----------------------------------------------------\r\n2. GENERAL\r\n-------------------------------------------------------- */\r\n\r\nbody {\r\n    font-family: 'Poppins', sans-serif;\r\n    line-height: 27px;\r\n    color: #525252;\r\n    font-weight: 400;\r\n    font-size: 16px;\r\n}\r\n\r\nh1,\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6 {\r\n    font-family: 'Raleway', sans-serif;\r\n    font-weight: 700;\r\n    color: #000000;\r\n    margin: 0 0 15px;\r\n}\r\n\r\nh1 {\r\n    font-size: 38px;\r\n}\r\n\r\nh2 {\r\n    font-size: 34px;\r\n}\r\n\r\nh3 {\r\n    font-size: 30px;\r\n}\r\n\r\nh4 {\r\n    font-size: 25px;\r\n}\r\n\r\nh5 {\r\n    font-size: 22px;\r\n}\r\n\r\nh6 {\r\n    font-size: 18px;\r\n}\r\n\r\na,\r\na:hover,\r\na:focus {\r\n    text-decoration: none;\r\n}\r\n\r\ninput:focus,\r\ntextarea:focus {\r\n    outline: none;\r\n}\r\n\r\na {\r\n    color: #0CA579;\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n}\r\n\r\nimg {\r\n    max-width: 100%;\r\n    height: auto;\r\n    display: block;\r\n}\r\n\r\n.img-bordered {\r\n    padding: 10px;\r\n    background: #ffffff;\r\n}\r\n\r\n.white-bg .img-bordered {\r\n    background: #f1f1f1;\r\n}\r\n\r\n\r\n/* Backgrounds */\r\n\r\n.relative {\r\n    position: relative;\r\n}\r\n\r\n.parallax-bg {\r\n    background-attachment: fixed;\r\n    background-repeat: no-repeat;\r\n    background-position: center center;\r\n    background-size: cover;\r\n}\r\n\r\n.gray-bg {\r\n    background-color: #f4f4f4;\r\n}\r\n\r\n.white-bg {\r\n    background-color: #ffffff;\r\n}\r\n\r\n\r\n/* color and gredient overlays */\r\n\r\n.tabs .indicator {\r\n    background-color: #0CA579;\r\n}\r\n\r\n.primary-color {\r\n    color: #0CA579\r\n}\r\n\r\n.primary-bg {\r\n    background: #0CA579;\r\n}\r\n\r\n.light-text {\r\n    color: #ffffff;\r\n}\r\n\r\n    .light-text h1,\r\n    .light-text h2,\r\n    .light-text h3,\r\n    .light-text h4,\r\n    .light-text h5,\r\n    .light-text h6 {\r\n        color: #ffffff;\r\n    }\r\n\r\n.color-overlay {\r\n    position: relative\r\n}\r\n\r\n    .color-overlay:before {\r\n        background: #000;\r\n        position: absolute;\r\n        content: \"\";\r\n        top: 0;\r\n        left: 0;\r\n        width: 100%;\r\n        height: 100%;\r\n        opacity: 0.5;\r\n    }\r\n\r\n.hero-video.color-overlay:before {\r\n    z-index: 9;\r\n}\r\n\r\n\r\n/* Margins and paddings */\r\n\r\n.section-padding {\r\n    padding-top: 30px;\r\n    /*padding-bottom: 100px;*/\r\n}\r\n\r\n.mb0 {\r\n    margin-bottom: 0px !important;\r\n}\r\n\r\n.mb50 {\r\n    margin-bottom: 50px;\r\n}\r\n\r\n.mt50 {\r\n    margin-top: 50px;\r\n}\r\n\r\n.mb70 {\r\n    margin-bottom: 70px;\r\n}\r\n\r\n\r\n.mb30 {\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.mt70 {\r\n    margin-top: 70px;\r\n}\r\n\r\n.mb80 {\r\n    margin-bottom: 80px;\r\n}\r\n\r\n.mt30 {\r\n    margin-top: 30px;\r\n}\r\n\r\n.mb30 {\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.mb13 {\r\n    margin-bottom: 13px;\r\n}\r\n\r\n.mt15 {\r\n    margin-top: 15px;\r\n}\r\n\r\n.mb15 {\r\n    margin-bottom: 15px;\r\n}\r\n\r\n.mt10 {\r\n    margin-top: 10px;\r\n}\r\n\r\n.mb-0 {\r\n    margin-bottom: 0px;\r\n}\r\n\r\n\r\n/* Paddings */\r\n\r\n.pt160 {\r\n    padding-top: 160px;\r\n}\r\n\r\n.pt80 {\r\n    padding-top: 80px;\r\n}\r\n\r\n.pb80 {\r\n    padding-bottom: 80px;\r\n}\r\n\r\n.pr80 {\r\n    padding-right: 80px;\r\n}\r\n\r\n.pl80 {\r\n    padding-left: 80px;\r\n}\r\n\r\n.pt50 {\r\n    padding-top: 50px;\r\n}\r\n\r\n.pt57 {\r\n    padding-top: 57px;\r\n}\r\n\r\n.pb50 {\r\n    padding-bottom: 50px;\r\n}\r\n\r\n.pt50 {\r\n    padding-top: 50px;\r\n}\r\n\r\n.pr50 {\r\n    padding-right: 50px;\r\n}\r\n\r\n.pl50 {\r\n    padding-left: 50px;\r\n}\r\n\r\n.pt30 {\r\n    padding-top: 30px;\r\n}\r\n\r\n.pb30 {\r\n    padding-bottom: 30px;\r\n}\r\n\r\n.pb25 {\r\n    padding-bottom: 25px;\r\n}\r\n\r\n.pt25 {\r\n    padding-top: 25px;\r\n}\r\n\r\n\r\n/* Alaignments */\r\n\r\n.align-left {\r\n    float: left;\r\n    margin-right: 15px;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n\r\n/* duplicate Materalized CSS */\r\n\r\n.btn:hover,\r\n.btn-large:hover {\r\n    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);\r\n    color: #ffffff;\r\n    opacity: 0.8;\r\n}\r\n\r\n.slider .slides {\r\n    background-color: #000000;\r\n}\r\n\r\ninput:not([type]):focus:not([readonly]),\r\ninput[type=text]:focus:not([readonly]),\r\ninput[type=password]:focus:not([readonly]),\r\ninput[type=email]:focus:not([readonly]),\r\ninput[type=url]:focus:not([readonly]),\r\ninput[type=time]:focus:not([readonly]),\r\ninput[type=date]:focus:not([readonly]),\r\ninput[type=datetime]:focus:not([readonly]),\r\ninput[type=datetime-local]:focus:not([readonly]),\r\ninput[type=tel]:focus:not([readonly]),\r\ninput[type=number]:focus:not([readonly]),\r\ninput[type=search]:focus:not([readonly]),\r\ntextarea.materialize-textarea:focus:not([readonly]) {\r\n    border-bottom: 1px solid #0CA579;\r\n    box-shadow: 0 1px 0 0 #0CA579;\r\n}\r\n\r\n\r\n/* Section titles */\r\n\r\n.section-title h2 {\r\n    margin-top: 0px;\r\n}\r\n\r\n.section-divider {\r\n    margin-top: 20px;\r\n}\r\n\r\n.section-title p {\r\n    width: 50%;\r\n    margin: 0 auto;\r\n}\r\n\r\n.ilm-subtitle {\r\n    position: relative;\r\n}\r\n\r\nh3.ilm-subtitle:before {\r\n    position: absolute;\r\n    content: \"\";\r\n    width: 45px;\r\n    height: 3px;\r\n    background-color: #0CA579;\r\n    bottom: -15px;\r\n}\r\n\r\n/* BREADCRAMB 1 */\r\n.breadcramb-content.parallax-bg h3 {\r\n    color: #ffffff;\r\n}\r\n\r\n.breadcramb-content ul {\r\n    text-align: center;\r\n    list-style: none;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n    .breadcramb-content ul li {\r\n        display: inline-block;\r\n        font-size: 12px;\r\n        font-weight: 600;\r\n        padding: 0 3px;\r\n        text-transform: uppercase;\r\n        letter-spacing: 2px;\r\n        position: relative;\r\n    }\r\n\r\n.breadcramb-content.parallax-bg ul li {\r\n    color: #ffffff;\r\n}\r\n\r\n.breadcramb-content ul li:after {\r\n    background-color: #000;\r\n    content: \"\";\r\n    height: 1px;\r\n    position: absolute;\r\n    right: -3px;\r\n    top: 50%;\r\n    -webkit-transform: translateY(-50%);\r\n    transform: translateY(-50%);\r\n    width: 3px;\r\n}\r\n\r\n.breadcramb-content.parallax-bg ul li:after {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.breadcramb-content ul li:last-child:after {\r\n    width: 0px;\r\n}\r\n\r\n.breadcramb-content.parallax-bg ul li a:hover {\r\n    color: #ffffff;\r\n}\r\n\r\n.breadcramb-v2 h3 {\r\n    margin-bottom: 0px;\r\n    text-align: left;\r\n}\r\n\r\n.breadcramb-v2.breadcramb-content ul {\r\n    text-align: right;\r\n    margin-top: 5px;\r\n}\r\n\r\n/* Dashed divider  */\r\n\r\n.divider-dashed {\r\n    width: 50px;\r\n    background-color: #0CA579;\r\n    height: 2px;\r\n    margin: 0 auto;\r\n    margin-top: 20px;\r\n}\r\n\r\n\r\n/* Circle divider  */\r\n\r\n.divider-circle {\r\n    width: 200px;\r\n    border: 1px solid #0CA579;\r\n    opacity: 0.4;\r\n    position: relative;\r\n    display: inline-block;\r\n}\r\n\r\n    .divider-circle:before {\r\n        position: absolute;\r\n        content: \"\";\r\n        width: 18px;\r\n        height: 18px;\r\n        border-radius: 50%;\r\n        background-color: #0CA579;\r\n        top: -9px;\r\n        opacity: 0.4;\r\n        -ms-transform: rotate(45deg);\r\n        -webkit-transform: rotate(45deg);\r\n        transform: rotate(45deg);\r\n    }\r\n\r\n    .divider-circle:after {\r\n        position: absolute;\r\n        content: \"\";\r\n        width: 18px;\r\n        height: 18px;\r\n        border-radius: 50%;\r\n        background-color: #0CA579;\r\n        top: -9px;\r\n        left: 45%;\r\n        opacity: 0.4;\r\n        -ms-transform: rotate(45deg);\r\n        -webkit-transform: rotate(45deg);\r\n        transform: rotate(45deg);\r\n    }\r\n\r\n\r\n/* Traingle divider */\r\n\r\n.divider-traingle {\r\n    width: 200px;\r\n    border: 1px solid #0CA579;\r\n    opacity: 0.4;\r\n    position: relative;\r\n    display: inline-block;\r\n}\r\n\r\n    .divider-traingle:before {\r\n        position: absolute;\r\n        content: \"\";\r\n        width: 18px;\r\n        height: 18px;\r\n        background-color: #0CA579;\r\n        top: -9px;\r\n        opacity: 0.4;\r\n        -ms-transform: rotate(45deg);\r\n        -webkit-transform: rotate(45deg);\r\n        transform: rotate(45deg);\r\n    }\r\n\r\n    .divider-traingle:after {\r\n        position: absolute;\r\n        content: \"\";\r\n        width: 18px;\r\n        height: 18px;\r\n        background: #0CA579;\r\n        top: -9px;\r\n        left: 45%;\r\n        opacity: 0.4;\r\n        -ms-transform: rotate(45deg);\r\n        -webkit-transform: rotate(45deg);\r\n        transform: rotate(45deg);\r\n    }\r\n\r\n\r\n/* lines divider */\r\n\r\n.lines {\r\n    width: 6px;\r\n    position: relative;\r\n    border-top: 2px solid #0CA579;\r\n    margin: auto;\r\n    margin-top: 20px;\r\n}\r\n\r\n    .lines:before,\r\n    .lines:after {\r\n        content: \"\";\r\n        position: absolute;\r\n        top: -2px;\r\n        width: 30px;\r\n        border-top: 2px solid #0CA579;\r\n    }\r\n\r\n    .lines:before {\r\n        left: -34px;\r\n    }\r\n\r\n    .lines:after {\r\n        right: -34px;\r\n    }\r\n\r\n\r\n/**\r\n * ================================\r\n * CUSTOM BUTTONS\r\n * ================================\r\n */\r\n.btn-large {\r\n    font-weight: 600;\r\n}\r\n\r\n    .btn:focus,\r\n    .btn-large:focus,\r\n    .btn-floating:focus {\r\n        background-color: #0CA579;\r\n        color: #ffffff;\r\n    }\r\n\r\n    .btn-large.btn-transparent {\r\n        background-color: transparent;\r\n        border: 1px solid #ffffff;\r\n    }\r\n\r\n.btn-transparent:hover {\r\n    border: 1px solid transparent;\r\n    opacity: 1;\r\n    background-color: #0CA579;\r\n}\r\n\r\n.btn-white {\r\n    background-color: #ffffff !important;\r\n    color: #525252\r\n}\r\n\r\n    .btn-white:hover {\r\n        background: #ffffff;\r\n        color: #000000;\r\n    }\r\n\r\n\r\n/**\r\n * ================================\r\n * CONTAINER HALF CONTENT\r\n * ================================\r\n */\r\n\r\n\r\n.features-section-2 a.btn-large {\r\n    margin-top: 15px;\r\n}\r\n\r\n.content-half {\r\n    position: relative;\r\n    overflow: hidden;\r\n}\r\n\r\n.container-half {\r\n    position: absolute;\r\n    vertical-align: middle;\r\n    top: 0;\r\n    bottom: 0;\r\n    width: 50%;\r\n}\r\n\r\n    .container-half.pr30 {\r\n        width: calc(50% - 30px);\r\n    }\r\n\r\n.cover {\r\n    background-size: cover;\r\n    background-repeat: no-repeat;\r\n}\r\n\r\n.container-half-left {\r\n    left: 0;\r\n    background-position: top left;\r\n}\r\n\r\n.container-half-right {\r\n    right: 0;\r\n    background-position: top right;\r\n}\r\n\r\n@media (max-width: 991px) {\r\n    .container-half {\r\n        position: inherit;\r\n        width: 100%;\r\n    }\r\n}\r\n\r\n\r\n/*  ----------------------------------------------------\r\n3. HEADAER\r\n-------------------------------------------------------- */\r\n\r\n\r\n/* Header top */\r\n\r\n.header-top {\r\n    padding-top: 10px;\r\n    padding-bottom: 10px;\r\n}\r\n\r\n    .header-top,\r\n    .header-top a {\r\n        color: #ffffff;\r\n    }\r\n\r\n        .header-top i {\r\n            margin-right: 5px;\r\n        }\r\n\r\n        .header-top ul {\r\n            display: inline;\r\n            margin: 0px;\r\n            padding: 0px;\r\n        }\r\n\r\n            .header-top ul li {\r\n                display: inline-block;\r\n                margin-right: 20px;\r\n            }\r\n\r\n        .header-top .social-link {\r\n            text-align: right;\r\n        }\r\n\r\n            .header-top .social-link li:last-child {\r\n                margin-right: 0px;\r\n            }\r\n\r\n#header {\r\n    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\r\n    z-index: 999;\r\n}\r\n\r\n.navbar-inverse .navbar-brand:focus,\r\n.navbar-inverse .navbar-brand:hover {\r\n    color: #26547c;\r\n}\r\n\r\n#header .navbar-inverse .container {\r\n    position: relative;\r\n}\r\n\r\n.navbar-brand {\r\n    height: auto;\r\n}\r\n\r\n.search {\r\n    position: absolute;\r\n    top: 28px;\r\n    right: 0;\r\n    z-index: 1;\r\n}\r\n\r\n    .search i {\r\n        color: #0CA579;\r\n        cursor: pointer;\r\n        position: absolute;\r\n        right: 10px;\r\n        top: 2px;\r\n    }\r\n\r\n.field-toggle {\r\n    position: relative;\r\n    top: 30px;\r\n    right: 15px;\r\n    display: none;\r\n    height: 50px;\r\n}\r\n\r\ninput[type=text].search-form {\r\n    padding-left: 10px;\r\n    height: 40px;\r\n    font-size: 18px;\r\n    color: #818285;\r\n    font-weight: 300;\r\n    outline: none;\r\n    margin-top: 18px;\r\n    background-color: #ffffff;\r\n    border: 1px solid #cccccc;\r\n}\r\n\r\n#header,\r\n#header .navbar {\r\n    background-color: #fff;\r\n    border: 0;\r\n    margin-bottom: 0;\r\n}\r\n\r\n    #header .navbar-toggle {\r\n        margin-top: 20px;\r\n    }\r\n\r\n.sticky-wrapper.is-sticky #header {\r\n    width: 100%;\r\n    z-index: 999;\r\n}\r\n\r\n#header {\r\n    position: relative;\r\n}\r\n\r\n    #header .navbar-brand {\r\n        padding: 0;\r\n        margin-left: 0;\r\n    }\r\n\r\n        #header .navbar-brand h1 {\r\n            padding: 0;\r\n            margin: 0;\r\n        }\r\n\r\n    #header .navbar-nav.navbar-right > li:last-child {\r\n        margin-right: 20px;\r\n    }\r\n\r\n    #header .navbar-nav.navbar-right > li a {\r\n        padding: 28px 20px;\r\n        text-transform: uppercase;\r\n        font-weight: 300;\r\n    }\r\n\r\n    #header .navbar-inverse .navbar-nav li.active > a,\r\n    #header .navbar-inverse .navbar-nav li.active > a:focus,\r\n    #header .navbar-nav.navbar-right li > a:hover,\r\n    .navbar-inverse .navbar-nav > .open > a {\r\n        background-color: inherit;\r\n        border: 0;\r\n        color: #0CA579;\r\n    }\r\n\r\n    #header .navbar-inverse .navbar-nav li a:hover {\r\n        color: #0CA579;\r\n    }\r\n\r\n\r\n/*  Dropdown menu*/\r\n\r\nul.sub-menu {\r\n    display: none;\r\n    list-style: none;\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\n#header .navbar-nav li ul.sub-menu li a {\r\n    color: #818285;\r\n    padding: 5px 0;\r\n    font-size: 14px;\r\n    display: block;\r\n    text-transform: capitalize;\r\n}\r\n\r\n#header .navbar-nav li ul.sub-menu li .active {\r\n    background-color: #0CA579;\r\n    color: #fff;\r\n    position: relative;\r\n}\r\n\r\n    #header .navbar-nav li ul.sub-menu li .active i {\r\n        position: absolute;\r\n        font-size: 56px;\r\n        top: -13px;\r\n        color: #0884d5;\r\n    }\r\n\r\n    #header .navbar-nav li ul.sub-menu li .active .fa-angle-right {\r\n        left: -3px;\r\n    }\r\n\r\n    #header .navbar-nav li ul.sub-menu li .active .fa-angle-left {\r\n        right: -3px;\r\n    }\r\n\r\n#header .navbar-nav li ul.sub-menu li a:hover,\r\n#header .navbar-nav li ul.sub-menu li a:focus {\r\n    background-color: #0CA579;\r\n    color: #fff;\r\n}\r\n\r\n.fa-angle-down {\r\n    padding-left: 5px;\r\n}\r\n\r\n.scaleIn {\r\n    -webkit-animation-name: scaleIn;\r\n    animation-name: scaleIn;\r\n}\r\n\r\n@-webkit-keyframes scaleIn {\r\n    0% {\r\n        opacity: 0;\r\n        -webkit-transform: scale(0);\r\n        transform: scale(0);\r\n    }\r\n\r\n    100% {\r\n        opacity: 1;\r\n        -webkit-transform: scale(1);\r\n        transform: scale(1);\r\n    }\r\n}\r\n\r\n@keyframes scaleIn {\r\n    0% {\r\n        opacity: 0;\r\n        -webkit-transform: scale(0);\r\n        -ms-transform: scale(0);\r\n        transform: scale(0);\r\n    }\r\n\r\n    100% {\r\n        opacity: 1;\r\n        -webkit-transform: scale(1);\r\n        -ms-transform: scale(1);\r\n        transform: scale(1);\r\n    }\r\n}\r\n\r\n/*  ----------------------------------------------------\r\n3. SLIDER\r\n-------------------------------------------------------- */\r\n\r\n.slider.fullscreen ul.slides {\r\n    position: relative;\r\n}\r\n\r\n.slider .slides li:before {\r\n    content: \"\";\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: #000000;\r\n    opacity: 0.5;\r\n}\r\n\r\n.slider.fullscreen {\r\n    height: 100vh;\r\n    position: relative;\r\n}\r\n\r\n.slider .slides li .caption {\r\n    padding-top: 50px;\r\n    padding-bottom: 50px;\r\n    top: 55%;\r\n    transform: translate(0%, -50%) !important;\r\n    -moz-transform: translate(0%, -50%) !important;\r\n    -webkit-transform: translate(0%, -50%) !important;\r\n    -o-transform: translate(0%, -50%) !important;\r\n}\r\n\r\n    .slider .slides li .caption h1,\r\n    .hero-video h1 {\r\n        font-size: 60px;\r\n        text-transform: uppercase;\r\n        line-height: 60px;\r\n    }\r\n\r\n    .slider .slides li .caption h5,\r\n    .hero-video h5 {\r\n        margin-bottom: 25px;\r\n        color: #ffffff;\r\n        font-weight: 300;\r\n        line-height: 35px;\r\n    }\r\n\r\n.white-text h1,\r\n.white-text h2,\r\n.white-text h3,\r\n.white-text h4,\r\n.white-text h5,\r\n.white-text h6,\r\n.white-text p,\r\n.white-text,\r\n.white-text .form-control {\r\n    color: #ffffff;\r\n}\r\n\r\n.slider .indicators .indicator-item {\r\n    width: 10px;\r\n    height: 10px;\r\n}\r\n\r\n    .slider .indicators .indicator-item:after {\r\n        position: absolute;\r\n        width: 20px;\r\n        height: 20px;\r\n        border: 2px solid #0CA579;\r\n        content: \"\";\r\n        left: 50%;\r\n        top: 50%;\r\n        border-radius: 50%;\r\n        transform: translate(-50%, -50%);\r\n        -moz-transform: translate(-50%, -50%);\r\n        -webkit-transform: translate(-50%, -50%);\r\n        -o-transform: translate(-50%, -50%);\r\n    }\r\n\r\n    .slider .indicators .indicator-item.active {\r\n        background-color: #0CA579;\r\n    }\r\n\r\n\r\n/* Youtube video */\r\n\r\n.hero-video {\r\n    position: relative;\r\n    height: 100vh;\r\n}\r\n\r\n    .hero-video .color-overlay {\r\n        z-index: 99;\r\n    }\r\n\r\n    .hero-video .container {\r\n        position: absolute;\r\n        left: 50%;\r\n        top: 50%;\r\n        -webkit-transform: translate(-50%, -50%);\r\n        -moz-transform: translate(-50%, -50%);\r\n        -ms-transform: translate(-50%, -50%);\r\n        -o-transform: translate(-50%, -50%);\r\n        transform: translate(-50%, -50%);\r\n        color: #ffffff;\r\n        z-index: 99;\r\n    }\r\n\r\n.background-video {\r\n    background-position: top center;\r\n    background-repeat: no-repeat;\r\n    bottom: 0;\r\n    left: 0;\r\n    overflow: hidden;\r\n    position: absolute;\r\n    right: 0;\r\n    top: 0;\r\n}\r\n\r\nvideo,\r\nsource {\r\n    bottom: 0;\r\n    left: 0;\r\n    min-height: 100%;\r\n    min-width: 100%;\r\n    position: absolute;\r\n}\r\n\r\n.loaded .ytplayer-container {\r\n    display: block;\r\n}\r\n\r\n.loaded .placeholder-image {\r\n    opacity: 0;\r\n}\r\n\r\n.ytplayer-container {\r\n    bottom: 0;\r\n    height: 100%;\r\n    left: 0;\r\n    min-width: 100%;\r\n    overflow: hidden;\r\n    position: absolute;\r\n    right: 0;\r\n    top: 0;\r\n    z-index: 3;\r\n}\r\n\r\n.placeholder-image {\r\n    height: 100%;\r\n    left: 0;\r\n    min-height: 100%;\r\n    min-width: 100%;\r\n    position: absolute;\r\n    top: 0;\r\n    z-index: 1;\r\n}\r\n\r\n.ytplayer-shield {\r\n    height: 100%;\r\n    left: 0;\r\n    position: absolute;\r\n    top: 0;\r\n    width: 100%;\r\n    z-index: 2;\r\n}\r\n\r\n.ytplayer-player {\r\n    position: absolute;\r\n}\r\n\r\n\r\n/*\r\n5.Slider Section\r\n======================*/\r\n\r\n.main-slider {\r\n    position: relative;\r\n}\r\n\r\n.single-slide.slider-opacity {\r\n    position: relative;\r\n}\r\n\r\n    .single-slide.slider-opacity:before {\r\n        width: 100%;\r\n        height: 100%;\r\n        content: \"\";\r\n        background-color: #000;\r\n        position: absolute;\r\n        opacity: 0.4;\r\n    }\r\n\r\n.main-slider .owl-dots {\r\n    position: absolute;\r\n    bottom: 50px;\r\n    width: 100%;\r\n}\r\n\r\n.main-slider .owl-nav {\r\n    margin: 0px;\r\n}\r\n\r\n.all-slide .owl-item {\r\n    height: 550px;\r\n}\r\n\r\n.all-slide .single-slide {\r\n    background-size: cover;\r\n    background-position: center center;\r\n    background-repeat: no-repeat;\r\n    height: 100%;\r\n}\r\n\r\n.slider-text {\r\n    left: 0;\r\n    margin: 0 auto;\r\n    text-align: center;\r\n    position: relative;\r\n    right: 0;\r\n    text-align: center;\r\n    top: 50%;\r\n    transform: translateY(-50%);\r\n    z-index: 2;\r\n    max-width: 1170px;\r\n    width: 100%;\r\n    padding-left: 15px;\r\n    padding-right: 15px;\r\n}\r\n\r\n    .slider-text ul {\r\n        margin-top: 30px;\r\n    }\r\n\r\n    .slider-text h1 {\r\n        color: #fff;\r\n        font-size: 54px;\r\n        text-transform: uppercase;\r\n        font-weight: 800;\r\n        line-height: 70px;\r\n    }\r\n\r\n        .slider-text h1 span {\r\n            color: #0CA579;\r\n        }\r\n\r\n    .slider-text p {\r\n        color: #ffffff;\r\n        font-size: 18px;\r\n    }\r\n\r\n    .slider-text li {\r\n        display: inline-block;\r\n    }\r\n\r\n        .slider-text li a {\r\n            background-color: transparent;\r\n            color: #fff;\r\n            display: inline-block;\r\n            padding: 14px 30px;\r\n            text-transform: uppercase;\r\n            margin: 0px 10px;\r\n            border: 1px solid #0CA579;\r\n            position: relative;\r\n            z-index: 5;\r\n            transition: 0.5s;\r\n        }\r\n\r\n            .slider-text li a:hover {\r\n                background-color: #0CA579;\r\n                color: #fff;\r\n                webkit-transition: all 0.4s ease-in-out;\r\n                -moz-transition: all 0.4s ease-in-out;\r\n                -o-transition: all 0.4s ease-in-out;\r\n                transition: all 0.4s ease-in-out;\r\n                border-color: #0CA579;\r\n            }\r\n\r\n        .slider-text li:last-child a {\r\n            border-color: #fff;\r\n        }\r\n\r\n            .slider-text li:last-child a:hover {\r\n                background-color: #fff;\r\n                color: #292929;\r\n                webkit-transition: all 0.4s ease-in-out;\r\n                -moz-transition: all 0.4s ease-in-out;\r\n                -o-transition: all 0.4s ease-in-out;\r\n                transition: all 0.4s ease-in-out;\r\n                border-color: #fff;\r\n            }\r\n\r\n.main-slider .owl-nav .owl-next {\r\n    right: 20px;\r\n    position: absolute;\r\n    bottom: 50%;\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n}\r\n\r\n.main-slider .owl-nav .owl-prev {\r\n    left: 20px;\r\n    position: absolute;\r\n    bottom: 50%;\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n}\r\n\r\n.slider-text.animated-text span {\r\n    color: #ffffff;\r\n}\r\n\r\n\r\n/*  ----------------------------------------------------\r\n4. WHAT WE DO / FEATURED SECTION\r\n-------------------------------------------------------- */\r\nsection {\r\n    font-size: 14px !important;\r\n}\r\n.featured-box {\r\n    padding-top: 15px;\r\n    padding-bottom: 15px;\r\n    padding-left: 25px;\r\n    padding-right: 25px;\r\n    margin-bottom: 30px;\r\n    background-color: #ffffff;\r\n    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n    \r\n}\r\n\r\n    .featured-box .icon {\r\n        font-size: 55px;\r\n        margin-bottom: 20px;\r\n        color: #0CA579;\r\n    }\r\n\r\n    .featured-box h3 {\r\n        font-size: 22px;\r\n    }\r\n\r\n    .featured-box p {\r\n        line-height: 27px;\r\n    }\r\n\r\n    .featured-box:hover {\r\n        /*background-color: #0CA579;*/\r\n        /*color: #ffffff!important;*/\r\n        box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n        border-radius: 5px;\r\n    }\r\n\r\n      \r\n\r\n        .featured-box:hover a:hover {\r\n           \r\n            text-decoration:underline;\r\n        }\r\n\r\n        .featured-box:hover .icon,\r\n        .featured-box:hover h3, .featured-box:hover h4 {\r\n            \r\n            webkit-transition: all 0.4s ease-in-out;\r\n            -moz-transition: all 0.4s ease-in-out;\r\n            -o-transition: all 0.4s ease-in-out;\r\n            transition: all 0.4s ease-in-out;\r\n        }\r\n\r\n\r\n/*  ----------------------------------------------------\r\n5. SERVICES V2\r\n-------------------------------------------------------- */\r\n\r\n.featured-box-v2 {\r\n    padding: 0px;\r\n}\r\n\r\n    .featured-box-v2 .featured-box {\r\n        box-shadow: none;\r\n        border-radius: 0px;\r\n        margin-bottom: 0px;\r\n        position: relative;\r\n    }\r\n\r\n.white-bg .featured-box-v2:hover .featured-box {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.featured-box-v2 .featured-box:hover {\r\n    box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n    background-color: #ffffff;\r\n    z-index: 2;\r\n}\r\n\r\n    .featured-box-v2 .featured-box:hover .icon,\r\n    .featured-box-v2 .featured-box:hover h3 {\r\n        color: #000000;\r\n    }\r\n\r\n.featured-box-v2 .featured-box p {\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n}\r\n\r\n.featured-box-v2 .featured-box:hover p {\r\n    color: #525252\r\n}\r\n\r\n.featured-box-v2:nth-child(2) .featured-box,\r\n.featured-box-v2:nth-child(4) .featured-box,\r\n.featured-box-v2:nth-child(6) .featured-box {\r\n    background-color: #F4F4F4;\r\n}\r\n\r\n\r\n/*  ----------------------------------------------------\r\n6. WHAT WE DO / FEATURED SECTION 2\r\n-------------------------------------------------------- */\r\n\r\n.features-section-2 .inner {\r\n    padding-right: 50px;\r\n}\r\n\r\n.features-section-2 .pull-right .inner {\r\n    padding-right: 0px;\r\n    padding-left: 50px;\r\n}\r\n\r\n\r\n/*  ----------------------------------------------------\r\n7. TEAM MEMBERS\r\n-------------------------------------------------------- */\r\n.white-bg .each-box .detail {\r\n    background: #f1f1f1;\r\n}\r\n\r\n.each-box img {\r\n    width: 100%;\r\n}\r\n\r\n.each-box {\r\n    overflow: hidden;\r\n}\r\n\r\n    .each-box .inner {\r\n        webkit-transition: all 0.4s ease-in-out;\r\n        -moz-transition: all 0.4s ease-in-out;\r\n        -o-transition: all 0.4s ease-in-out;\r\n        transition: all 0.4s ease-in-out;\r\n        margin-bottom: 30px;\r\n    }\r\n\r\n        .each-box .inner:hover,\r\n        .white-bg .each-box .inner {\r\n            box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n        }\r\n\r\n    .each-box .box-hover {\r\n        position: relative;\r\n        line-height: 30px;\r\n        display: flex;\r\n        align-items: center;\r\n        justify-content: center;\r\n        -webkit-transition: all 0.4s ease-out;\r\n        -moz-transition: all 0.4s ease-out;\r\n        -o-transition: all 0.4s ease-out;\r\n        -ms-transition: all 0.4s ease-out;\r\n        transition: all 0.4s ease-out;\r\n    }\r\n\r\n        .each-box .box-hover:after {\r\n            content: \"\";\r\n            background-color: rgba(43, 50, 63, 0.85);\r\n            width: 100%;\r\n            height: 100%;\r\n            left: 0;\r\n            top: -30px;\r\n            position: absolute;\r\n            opacity: 0;\r\n            -webkit-transition: all 0.4s ease-out;\r\n            -moz-transition: all 0.4s ease-out;\r\n            -o-transition: all 0.4s ease-out;\r\n            -ms-transition: all 0.4s ease-out;\r\n            transition: all 0.4s ease-out;\r\n            -webkit-transform-style: preserve-3d;\r\n            -moz-transform-style: preserve-3d;\r\n            -o-transform-style: preserve-3d;\r\n            -ms-transform-style: preserve-3d;\r\n            transform-style: preserve-3d;\r\n            -webkit-font-smoothing: antialiased;\r\n            -moz-osx-font-smoothing: grayscale;\r\n        }\r\n\r\n    .each-box:hover .box-hover:after {\r\n        opacity: 1;\r\n        top: 0;\r\n    }\r\n\r\n    .each-box .mask {\r\n        position: absolute;\r\n        width: 100%;\r\n        z-index: 1;\r\n        opacity: 0;\r\n    }\r\n\r\n    .each-box .inner:hover .mask {\r\n        opacity: 1;\r\n    }\r\n\r\n    .each-box .mask .mask-inner {\r\n        padding: 30px;\r\n    }\r\n\r\n    .each-box .pera-text {\r\n        color: #ffffff;\r\n        margin-bottom: 25px;\r\n        -webkit-transition: all 0.4s ease-out;\r\n        -moz-transition: all 0.4s ease-out;\r\n        -o-transition: all 0.4s ease-out;\r\n        -ms-transition: all 0.4s ease-out;\r\n        transition: all 0.4s ease-out;\r\n        -webkit-transform-style: preserve-3d;\r\n        -moz-transform-style: preserve-3d;\r\n        -o-transform-style: preserve-3d;\r\n        -ms-transform-style: preserve-3d;\r\n        transform-style: preserve-3d;\r\n        -webkit-font-smoothing: antialiased;\r\n        -moz-osx-font-smoothing: grayscale;\r\n        transform: translateX(0) translateY(-60px) translateZ(0) rotate(0deg) scale(1);\r\n        -o-transform: translateX(0) translateY(-60px) translateZ(0) rotate(0deg) scale(1);\r\n        -ms-transform: translateX(0) translateY(-60px) translateZ(0) rotate(0deg) scale(1);\r\n        -moz-transform: translateX(0) translateY(-60px) translateZ(0) rotate(0deg) scale(1);\r\n        -webkit-transform: translateX(0) translateY(-60px) translateZ(0) rotate(0deg) scale(1);\r\n    }\r\n\r\n    .each-box .inner:hover .title,\r\n    .each-box .inner:hover .pera-text {\r\n        transform: translateX(0) translateY(0) translateZ(0) rotate(0deg) scale(1);\r\n        -o-transform: translateX(0) translateY(0) translateZ(0) rotate(0deg) scale(1);\r\n        -ms-transform: translateX(0) translateY(0) translateZ(0) rotate(0deg) scale(1);\r\n        -moz-transform: translateX(0) translateY(0) translateZ(0) rotate(0deg) scale(1);\r\n        -webkit-transform: translateX(0) translateY(0) translateZ(0) rotate(0deg) scale(1);\r\n    }\r\n\r\n    .each-box .title {\r\n        font-weight: 600;\r\n        font-size: 18px;\r\n        color: rgba(255, 255, 255, 0.85);\r\n        -webkit-transition: all 0.4s ease-out;\r\n        -moz-transition: all 0.4s ease-out;\r\n        -o-transition: all 0.4s ease-out;\r\n        -ms-transition: all 0.4s ease-out;\r\n        transition: all 0.4s ease-out;\r\n        -webkit-transform-style: preserve-3d;\r\n        -moz-transform-style: preserve-3d;\r\n        -o-transform-style: preserve-3d;\r\n        -ms-transform-style: preserve-3d;\r\n        transform-style: preserve-3d;\r\n        -webkit-font-smoothing: antialiased;\r\n        -moz-osx-font-smoothing: grayscale;\r\n        transform: translateX(0) translateY(-30px) translateZ(0) rotate(0deg) scale(1);\r\n        -o-transform: translateX(0) translateY(-30px) translateZ(0) rotate(0deg) scale(1);\r\n        -ms-transform: translateX(0) translateY(-30px) translateZ(0) rotate(0deg) scale(1);\r\n        -moz-transform: translateX(0) translateY(-30px) translateZ(0) rotate(0deg) scale(1);\r\n        -webkit-transform: translateX(0) translateY(-30px) translateZ(0) rotate(0deg) scale(1);\r\n    }\r\n\r\n.social-icon {\r\n    display: inline-block;\r\n    margin-top: 10px;\r\n}\r\n\r\n    .social-icon li {\r\n        list-style: none;\r\n        float: left;\r\n        margin-bottom: 0px;\r\n    }\r\n\r\n.each-box .social-icon li {\r\n    -webkit-transition: all 0.3s ease-out;\r\n    -moz-transition: all 0.3s ease-out;\r\n    -o-transition: all 0.3s ease-out;\r\n    -ms-transition: all 0.3s ease-out;\r\n    transition: all 0.3s ease-out;\r\n    -webkit-transform-style: preserve-3d;\r\n    -moz-transform-style: preserve-3d;\r\n    -o-transform-style: preserve-3d;\r\n    -ms-transform-style: preserve-3d;\r\n    transform-style: preserve-3d;\r\n    -webkit-font-smoothing: antialiased;\r\n    -moz-osx-font-smoothing: grayscale;\r\n    transform: translateX(0) translateY(60px) translateZ(0) rotate(0deg) scale(1);\r\n    -o-transform: translateX(0) translateY(60px) translateZ(0) rotate(0deg) scale(1);\r\n    -ms-transform: translateX(0) translateY(60px) translateZ(0) rotate(0deg) scale(1);\r\n    -moz-transform: translateX(0) translateY(60px) translateZ(0) rotate(0deg) scale(1);\r\n    -webkit-transform: translateX(0) translateY(60px) translateZ(0) rotate(0deg) scale(1);\r\n    opacity: 0;\r\n}\r\n\r\n.each-box .inner:hover .social-icon li {\r\n    transform: translateX(0) translateY(0) translateZ(0) rotate(0deg) scale(1);\r\n    -o-transform: translateX(0) translateY(0) translateZ(0) rotate(0deg) scale(1);\r\n    -ms-transform: translateX(0) translateY(0) translateZ(0) rotate(0deg) scale(1);\r\n    -moz-transform: translateX(0) translateY(0) translateZ(0) rotate(0deg) scale(1);\r\n    -webkit-transform: translateX(0) translateY(0) translateZ(0) rotate(0deg) scale(1);\r\n    opacity: 1;\r\n}\r\n\r\n.each-box .social-icon li:nth-of-type(2) {\r\n    -webkit-transition-delay: 0.1s;\r\n    -moz-transition-delay: 0.1s;\r\n    -o-transition-delay: 0.1s;\r\n    transition-delay: 0.1s;\r\n}\r\n\r\n.each-box .social-icon li:nth-of-type(3) {\r\n    -webkit-transition-delay: 0.2s;\r\n    -moz-transition-delay: 0.2s;\r\n    -o-transition-delay: 0.2s;\r\n    transition-delay: 0.2s;\r\n}\r\n\r\n.each-box .social-icon li:nth-of-type(4) {\r\n    -webkit-transition-delay: 0.3s;\r\n    -moz-transition-delay: 0.3s;\r\n    -o-transition-delay: 0.3s;\r\n    transition-delay: 0.3s;\r\n}\r\n\r\n.social-icon li a {\r\n    font-size: 22px;\r\n    text-align: center;\r\n    width: 45px;\r\n    height: 45px;\r\n    line-height: 45px;\r\n    padding: 0px;\r\n    border-radius: 50%;\r\n    margin-right: 15px;\r\n    background-color: transparent;\r\n    color: #ffffff;\r\n    border: 1px solid;\r\n    border-color: #ffffff;\r\n}\r\n\r\n    .social-icon li a:hover {\r\n        background-color: #0CA579;\r\n        border-color: #0CA579;\r\n    }\r\n\r\n.each-box .detail {\r\n    padding: 25px 10px;\r\n}\r\n\r\n    .each-box .detail h6,\r\n    .each-box .detail p {\r\n        margin-bottom: 0px;\r\n        line-height: 30px;\r\n    }\r\n\r\n/* Team members v2 */\r\n.members-pic-wrap {\r\n    overflow: hidden;\r\n}\r\n\r\n    .members-pic-wrap .tabs,\r\n    .members-pic-wrap .tabs .tab {\r\n        height: auto;\r\n    }\r\n\r\n        .members-pic-wrap .tabs .tab a {\r\n            opacity: 0.2\r\n        }\r\n\r\n            .members-pic-wrap .tabs .tab a.active {\r\n                opacity: 1\r\n            }\r\n\r\n        .members-pic-wrap .tabs .tab a {\r\n            padding: 0px;\r\n            position: relative;\r\n        }\r\n\r\n    .members-pic-wrap .tabs {\r\n        background-color: none;\r\n    }\r\n\r\n        .members-pic-wrap .tabs .indicator {\r\n            height: 5px;\r\n        }\r\n\r\n.team-content h3 {\r\n    font-size: 24px;\r\n}\r\n\r\n    .team-content h3.ilm-subtitle {\r\n        font-size: 20px;\r\n    }\r\n\r\n.tabs {\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n/* classic portfolio */\r\n.classic-portfolio .social-icon {\r\n    transform: translate(-50%, -50%);\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    text-align: center;\r\n}\r\n\r\n    .classic-portfolio .social-icon li {\r\n        display: inline-block;\r\n        float: none;\r\n    }\r\n\r\n.classic-portfolio.portfolio-box {\r\n    padding-left: 15px;\r\n    padding-right: 15px;\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.classic-portfolio .classic-portoflio-content {\r\n    padding: 25px 15px;\r\n    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.05);\r\n    -webkit-transition-delay: 0.3s;\r\n    -moz-transition-delay: 0.3s;\r\n    -o-transition-delay: 0.3s;\r\n    transition-delay: 0.3s;\r\n    background-color: #F4F4F4;\r\n}\r\n\r\n.gray-bg .classic-portfolio .classic-portoflio-content {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.classic-portfolio:hover .classic-portoflio-content {\r\n    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n}\r\n\r\n.classic-portfolio .classic-portoflio-content h3 {\r\n    font-size: 18px;\r\n    text-transform: uppercase;\r\n    margin-bottom: 0px;\r\n}\r\n\r\n.classic-portfolio .classic-portoflio-content span {\r\n    font-size: 14px;\r\n    font-weight: 600;\r\n}\r\n\r\n/*  ----------------------------------------------------\r\n8. PORTFOLIOS\r\n-------------------------------------------------------- */\r\n.portfolio-filter {\r\n    margin-bottom: 45px;\r\n    padding: 0px;\r\n}\r\n\r\n    .portfolio-filter li {\r\n        display: inline-block;\r\n        margin-bottom: 15px;\r\n        margin-left: 3px;\r\n        margin-right: 3px;\r\n    }\r\n\r\n.portfolio-box {\r\n    padding: 0px;\r\n}\r\n\r\n    .portfolio-box .inner {\r\n        margin-bottom: 0px;\r\n    }\r\n\r\n.each-box.portfolio-box .mask .mask-inner {\r\n    height: 100%;\r\n}\r\n\r\n/* ----------------------------------------------------------------\r\nMagnific Popup Customisation for Smooth PopUp\r\n-------------------------------------------------------------------*/\r\n.mfp-fade.mfp-bg {\r\n    opacity: 0;\r\n    -webkit-transition: all 0.4s ease-out;\r\n    -moz-transition: all 0.4s ease-out;\r\n    transition: all 0.4s ease-out;\r\n}\r\n\r\n    .mfp-fade.mfp-bg.mfp-ready {\r\n        opacity: 0.75;\r\n    }\r\n\r\n.mfp-bottom-bar {\r\n    display: none;\r\n}\r\n\r\n.mfp-fade.mfp-bg.mfp-removing {\r\n    opacity: 0;\r\n}\r\n\r\n.mfp-arrow-right::after,\r\n.mfp-arrow-left::after {\r\n    font-family: 'FontAwesome';\r\n    border: none !important;\r\n    color: #fff;\r\n    font-size: 65px;\r\n    -webkit-transition: .5s;\r\n    transition: .5s;\r\n}\r\n\r\n.mfp-arrow-right::after {\r\n    content: \"\\F105\" !important;\r\n}\r\n\r\n.mfp-arrow-left::after {\r\n    content: \"\\F104\" !important;\r\n}\r\n\r\n.mfp-arrow-right::before,\r\n.mfp-arrow-left::before {\r\n    border: none !important;\r\n}\r\n\r\n.mfp-arrow {\r\n    height: 60px;\r\n}\r\n\r\n    .mfp-arrow::before,\r\n    .mfp-arrow::after,\r\n    .mfp-arrow .mfp-b,\r\n    .mfp-arrow .mfp-a {\r\n        margin-top: 15px;\r\n        top: -1px !important;\r\n    }\r\n\r\nimg.mfp-img {\r\n    padding: 40px 0px 0;\r\n}\r\n\r\n.mfp-fade.mfp-wrap .mfp-content {\r\n    opacity: 0;\r\n    transform: scale(0.95);\r\n    -webkit-transition: all 0.4s ease-out;\r\n    -moz-transition: all 0.4s ease-out;\r\n    transition: all 0.4s ease-out;\r\n}\r\n\r\n.mfp-fade.mfp-wrap.mfp-ready .mfp-content {\r\n    transform: scale(1);\r\n    opacity: 1;\r\n    -webkit-transition: all 0.4s ease-out;\r\n    -moz-transition: all 0.4s ease-out;\r\n    transition: all 0.4s ease-out;\r\n}\r\n\r\n.mfp-fade.mfp-wrap.mfp-removing .mfp-content {\r\n    opacity: 0;\r\n    transform: scale(0.95);\r\n    -webkit-transition: all 0.4s ease-out;\r\n    -moz-transition: all 0.4s ease-out;\r\n    transition: all 0.4s ease-out;\r\n}\r\n\r\n/* \r\n\r\n====== \"Hinge\" close effect ======\r\n\r\n*/\r\n@keyframes hinge {\r\n    0% {\r\n        transform: rotate(0);\r\n        transform-origin: top left;\r\n        animation-timing-function: ease-in-out;\r\n    }\r\n\r\n    20%, 60% {\r\n        transform: rotate(80deg);\r\n        transform-origin: top left;\r\n        animation-timing-function: ease-in-out;\r\n    }\r\n\r\n    40% {\r\n        transform: rotate(60deg);\r\n        transform-origin: top left;\r\n        animation-timing-function: ease-in-out;\r\n    }\r\n\r\n    80% {\r\n        transform: rotate(60deg) translateY(0);\r\n        opacity: 1;\r\n        transform-origin: top left;\r\n        animation-timing-function: ease-in-out;\r\n    }\r\n\r\n    100% {\r\n        transform: translateY(700px);\r\n        opacity: 0;\r\n    }\r\n}\r\n\r\n.hinge {\r\n    animation-duration: 1s;\r\n    animation-name: hinge;\r\n}\r\n\r\n.mfp-with-fade .mfp-content,\r\n.mfp-with-fade.mfp-bg {\r\n    opacity: 0;\r\n    transition: opacity .5s ease-out;\r\n}\r\n\r\n.mfp-with-fade.mfp-ready .mfp-content {\r\n    opacity: 1;\r\n}\r\n\r\n.mfp-with-fade.mfp-ready.mfp-bg {\r\n    opacity: 0.8;\r\n}\r\n\r\n.mfp-with-fade.mfp-removing.mfp-bg {\r\n    opacity: 0;\r\n}\r\n\r\n/* Pagenation */\r\n.portfolio-pagination {\r\n    text-align: center;\r\n    margin-top: 30px;\r\n}\r\n\r\n.pagination {\r\n    margin: 0px;\r\n}\r\n\r\n    .pagination li {\r\n        display: inline-block;\r\n        margin-bottom: 10px;\r\n        height: auto;\r\n    }\r\n\r\n        .pagination li a {\r\n            width: 42px;\r\n            height: 42px;\r\n            line-height: 42px;\r\n            padding: 0px;\r\n            margin: 0 8px;\r\n            border-radius: 3px;\r\n            border: 1px solid #fff;\r\n            background-color: #ffffff;\r\n        }\r\n\r\n            .pagination li a i {\r\n                line-height: 42px;\r\n            }\r\n\r\n.white-bg .pagination li a {\r\n    background-color: #F4F4F4;\r\n}\r\n\r\n.pagination li:first-child a,\r\n.pagination li:last-child a {\r\n    border: 1px solid #0CA579;\r\n}\r\n\r\n.pagination li a:hover,\r\n.pagination .active a,\r\n.pagination a:active,\r\n.pagination .active a:hover,\r\n.pagination .active a:focus,\r\n.pagination a:focus {\r\n    background-color: transparent;\r\n    border-color: #0CA579;\r\n    color: #0CA579;\r\n}\r\n\r\n.portfolio-pagination .pagination li.active {\r\n    background-color: none;\r\n}\r\n\r\n    .portfolio-pagination .pagination li.active a {\r\n        background: #0CA579;\r\n    }\r\n\r\n        .portfolio-pagination .pagination li.active a:hover {\r\n            color: #ffffff;\r\n        }\r\n\r\n/* Portfolios version 2 */\r\n.single-hr-p-content {\r\n    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n    margin-bottom: 30px;\r\n}\r\n\r\n    .single-hr-p-content:hover {\r\n        box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n    }\r\n\r\n    .single-hr-p-content ul {\r\n        text-align: left;\r\n        margin: 0;\r\n        padding: 0;\r\n        list-style: none;\r\n        margin-bottom: 5px;\r\n    }\r\n\r\n        .single-hr-p-content ul li {\r\n            display: inline;\r\n        }\r\n\r\n            .single-hr-p-content ul li a {\r\n                display: inline-block;\r\n                background-color: #000;\r\n                color: #ffffff;\r\n                padding: 4px 8px;\r\n                margin-right: 5px;\r\n                margin-bottom: 15px;\r\n            }\r\n\r\n                .single-hr-p-content ul li a:hover {\r\n                    background-color: #0CA579;\r\n                }\r\n\r\n    .single-hr-p-content h3 {\r\n        margin-bottom: 30px;\r\n    }\r\n\r\n    .single-hr-p-content p {\r\n        font-size: 18px;\r\n        line-height: 30px;\r\n    }\r\n\r\n/* portfolio sidebar */\r\n.sidebar .widget.popular-projects .gallery {\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n    .sidebar .widget.popular-projects .gallery li:before {\r\n        content: \"\";\r\n        position: inherit;\r\n    }\r\n\r\n    .sidebar .widget.popular-projects .gallery li {\r\n        margin: 0;\r\n        padding: 0;\r\n        border: none;\r\n        display: inline-block;\r\n        width: 33.33%;\r\n        padding: 8px;\r\n        float: left;\r\n    }\r\n\r\n        .sidebar .widget.popular-projects .gallery li a {\r\n            margin: 0px;\r\n        }\r\n\r\n            .sidebar .widget.popular-projects .gallery li a img {\r\n                transition: border-radius 300ms ease-in;\r\n                -webkit-transition: border-radius 300ms ease-in;\r\n            }\r\n\r\n            .sidebar .widget.popular-projects .gallery li a:hover img {\r\n                border-radius: 50%;\r\n            }\r\n\r\n/* PORTFOLIO DETAIL PAGE */\r\n.portfolio-meta {\r\n    padding: 25px 15px;\r\n    border: 1px solid #f1f1f1;\r\n}\r\n\r\n    .portfolio-meta ul {\r\n        margin: 0;\r\n        padding: 0;\r\n        list-style: none\r\n    }\r\n\r\n        .portfolio-meta ul li {\r\n            margin-bottom: 15px;\r\n        }\r\n\r\n            .portfolio-meta ul li span {\r\n                font-weight: 700;\r\n                width: 140px;\r\n                display: inline-block;\r\n            }\r\n\r\n/*  ----------------------------------------------------\r\n9. CALL TO ACTION \r\n-------------------------------------------------------- */\r\n.call-to-intro h5 {\r\n    margin-bottom: 10px;\r\n    letter-spacing: 3px;\r\n    font-size: 16px;\r\n}\r\n\r\n.call-to-intro h2 {\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.call-to-intro p {\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.call-to-intro a {\r\n    margin-left: 5px;\r\n    margin-right: 5px;\r\n    margin-bottom: 5px;\r\n    margin-top: 5px;\r\n}\r\n\r\n/*  ----------------------------------------------------\r\n10. TESTIMONIALS\r\n-------------------------------------------------------- */\r\n.slide-feedback .feedback-content:hover {\r\n    box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.15);\r\n}\r\n\r\n.feedback-content {\r\n    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n    margin-bottom: 30px;\r\n    position: relative;\r\n}\r\n\r\n    .feedback-content:hover {\r\n        box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n    }\r\n\r\n    .feedback-content blockquote {\r\n        border: none;\r\n        padding: 30px 50px;\r\n        margin: 0;\r\n    }\r\n\r\n.white-bg .feedback-content blockquote {\r\n    background-color: #F4F4F4;\r\n}\r\n\r\n.feedback-content .q-sign {\r\n    font-size: 120px;\r\n    color: #e0e0e0;\r\n    opacity: 0.3;\r\n    position: absolute;\r\n    line-height: 27px;\r\n}\r\n\r\n.feedback-content .top {\r\n    top: 55px;\r\n    left: 20px;\r\n}\r\n\r\n.feedback-content .bottom {\r\n    bottom: 20px;\r\n    right: 20px;\r\n}\r\n\r\n.feedback-content .author-info {\r\n    margin-top: 15px;\r\n}\r\n\r\n.author-info {\r\n    display: flex;\r\n}\r\n\r\n.feedback-content blockquote .client-image {\r\n    max-width: 100px;\r\n    margin-right: 20px;\r\n}\r\n\r\n.feedback-content blockquote .client-details {\r\n    padding-top: 30px;\r\n}\r\n\r\n    .feedback-content blockquote .client-details h6 {\r\n        margin-bottom: 0px;\r\n    }\r\n\r\n.extra-small-text {\r\n    font-size: 13px;\r\n}\r\n\r\n.owl-theme .owl-nav [class*='owl-'] {\r\n    background-color: #0CA579;\r\n    padding: 7px 12px;\r\n    font-size: 20px;\r\n}\r\n\r\n    .owl-theme .owl-nav [class*='owl-']:hover {\r\n        box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);\r\n        color: #ffffff;\r\n        background-color: #0CA579;\r\n        opacity: 0.8;\r\n    }\r\n\r\n.owl-theme .owl-dots .owl-dot span {\r\n    position: relative;\r\n    margin-left: 10px;\r\n    margin-right: 10px;\r\n    background-color: #f4f4f4;\r\n}\r\n\r\n.gray-bg .owl-theme .owl-dots .owl-dot span {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.owl-theme .owl-dots .owl-dot span:before {\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    width: 20px;\r\n    height: 20px;\r\n    border: 2px solid #0CA579;\r\n    content: \"\";\r\n    border-radius: 50%;\r\n    transform: translate(-50%, -50%);\r\n    -moz-transform: translate(-50%, -50%);\r\n    -webkit-transform: translate(-50%, -50%);\r\n    -o-transform: translate(-50%, -50%);\r\n    padding: 5px;\r\n}\r\n\r\n.owl-theme .owl-dots .owl-dot.active span,\r\n.owl-theme .owl-dots .owl-dot span:hover {\r\n    background-color: #0CA579;\r\n}\r\n\r\n/*  ----------------------------------------------------\r\n11. HOW WE WORK\r\n-------------------------------------------------------- */\r\n.features-item .icon-outer {\r\n    display: inline-table;\r\n    width: 90px;\r\n    height: 90px;\r\n    position: relative;\r\n    border-radius: 50% 50% 50% 50%;\r\n    -webkit-border-radius: 50% 50% 50% 50%;\r\n    -moz-border-radius: 50% 50% 50% 50%;\r\n    -ms-border-radius: 50% 50% 50% 50%;\r\n    -o-border-radius: 50% 50% 50% 50%;\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n    background-color: #ffffff;\r\n    box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n    -moz-box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n    -webkit-box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n    -o-box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n    color: #0CA579;\r\n    line-height: 90px;\r\n    font-size: 32px;\r\n}\r\n\r\n.features-item:hover .icon-outer {\r\n    background-color: #0CA579;\r\n    color: #ffffff;\r\n    box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n}\r\n\r\n.features-item .title {\r\n    font-size: 22px;\r\n    font-weight: 400;\r\n}\r\n\r\n.features-item {\r\n    position: relative;\r\n    z-index: 1;\r\n}\r\n\r\n    .features-item:after,\r\n    .features-item:before {\r\n        content: '';\r\n        width: 50%;\r\n        border-top: 1px solid;\r\n        position: absolute;\r\n        top: 45px;\r\n        transform: translateX(0) translateY(-50%) translateZ(0) rotate(0deg) scale(1);\r\n        -o-transform: translateX(0) translateY(-50%) translateZ(0) rotate(0deg) scale(1);\r\n        -ms-transform: translateX(0) translateY(-50%) translateZ(0) rotate(0deg) scale(1);\r\n        -moz-transform: translateX(0) translateY(-50%) translateZ(0) rotate(0deg) scale(1);\r\n        -webkit-transform: translateX(0) translateY(-50%) translateZ(0) rotate(0deg) scale(1);\r\n        z-index: -1;\r\n    }\r\n\r\n    .features-item::before {\r\n        right: 50%;\r\n    }\r\n\r\n    .features-item:after,\r\n    .features-item:before {\r\n        border-color: #ffffff;\r\n    }\r\n\r\n    .features-item:first-child::before {\r\n        border-color: transparent;\r\n    }\r\n\r\n    .features-item:last-child::after {\r\n        border-color: transparent;\r\n    }\r\n\r\n/*  ----------------------------------------------------\r\n12. PRICING TABLES\r\n-------------------------------------------------------- */\r\n\r\n.apt-table-wrapper header h2 {\r\n    font-weight: 300;\r\n    font-size: 60px;\r\n}\r\n\r\n.apt-table-wrapper header h3 {\r\n    font-size: 24px;\r\n}\r\n\r\n.apt-table-icon {\r\n    font-size: 30px;\r\n}\r\n\r\n.apt-table-content ul li {\r\n    font-size: 16px;\r\n}\r\n\r\n.apt-table-wrapper.apt-featured-table h2,\r\n.apt-table-wrapper.apt-featured-table h3,\r\n.apt-table-wrapper.apt-featured-table sub {\r\n    color: #ffffff;\r\n}\r\n\r\n.apt-table-style-five .apt-table-wrapper.apt-featured-table h2,\r\n.apt-table-style-five .apt-table-wrapper.apt-featured-table sub,\r\n.apt-table-style-five .apt-table-wrapper.apt-featured-table h3 {\r\n    color: #000;\r\n}\r\n\r\n.apt-table-style-five .apt-bsd-tooltip {\r\n    background: #fd8d7b;\r\n}\r\n\r\n    .apt-table-style-five .apt-bsd-tooltip:before {\r\n        color: #ffffff;\r\n    }\r\n\r\n.gray-bg .apt-table-style-five .apt-featured-table .apt-table-icon {\r\n    background: #ffffff;\r\n}\r\n\r\n.apt-table-wrapper sub {\r\n    font-size: 18px;\r\n}\r\n\r\n.apt-table-wrapper {\r\n    background-color: #ffffff;\r\n    border: 1px solid #f1f1f1;\r\n}\r\n\r\n    .apt-table-wrapper header {\r\n        background-color: #F4F4F4;\r\n        color: #181818;\r\n    }\r\n\r\n.gray-bg .apt-table-wrapper header {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.apt-table-wrapper.apt-featured-table header {\r\n    background-color: #0CA579;\r\n}\r\n\r\n.apt-table-icon {\r\n    color: #181818;\r\n    background-color: #fff;\r\n}\r\n\r\n.gray-bg .apt-table-icon {\r\n    background-color: #F4F4F4;\r\n}\r\n\r\n.apt-table-content ul li:nth-child(odd) {\r\n    background-color: #F4F4F4;\r\n}\r\n\r\n.apt-table-main-wrapper {\r\n    margin: 50px 0px;\r\n}\r\n\r\n.apt-padding-none {\r\n    padding: 0px;\r\n}\r\n\r\n.apt-bsd-tooltip {\r\n    background-color: #ffffff;\r\n}\r\n\r\n    .apt-bsd-tooltip:before {\r\n        color: #0CA579;\r\n    }\r\n\r\n    .apt-bsd-tooltip p {\r\n        background-color: #fff;\r\n        color: #0CA579;\r\n    }\r\n\r\n.apt-bsd-tooltip {\r\n    font-size: 16px;\r\n    line-height: 26px;\r\n}\r\n\r\n    .apt-bsd-tooltip:before {\r\n        font-weight: 900;\r\n    }\r\n\r\n    .apt-bsd-tooltip p {\r\n        font-size: 16px;\r\n    }\r\n\r\n.apt-bsd-tooltip {\r\n    position: absolute;\r\n    top: 15px;\r\n    right: 30px;\r\n    text-align: center;\r\n    border-radius: 50%;\r\n    width: 25px;\r\n    height: 25px;\r\n    cursor: default;\r\n    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1)\r\n}\r\n\r\n    .apt-bsd-tooltip:hover {\r\n        cursor: pointer;\r\n    }\r\n\r\n    .apt-bsd-tooltip:before {\r\n        content: '!';\r\n    }\r\n\r\n    .apt-bsd-tooltip p {\r\n        visibility: hidden;\r\n        opacity: 0;\r\n        text-align: left;\r\n        padding: 10px;\r\n        width: 180px;\r\n        position: absolute;\r\n        border-radius: 5px;\r\n        right: -6px;\r\n        line-height: normal;\r\n        transform: scale(0.7);\r\n        transform-origin: 100% 0%;\r\n        transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1)\r\n    }\r\n\r\n    .apt-bsd-tooltip:hover p {\r\n        cursor: default;\r\n        visibility: visible;\r\n        opacity: 1;\r\n        transform: scale(1.0)\r\n    }\r\n\r\n    .apt-bsd-tooltip p:before {\r\n        position: absolute;\r\n        content: '';\r\n        width: 0;\r\n        height: 0;\r\n        border: 6px solid transparent;\r\n        border-bottom-color: #0CA579;\r\n        right: 10px;\r\n        top: -12px\r\n    }\r\n\r\n    .apt-bsd-tooltip p:after {\r\n        width: 100%;\r\n        height: 40px;\r\n        content: '';\r\n        position: absolute;\r\n        top: -5px;\r\n        left: 0\r\n    }\r\n\r\n.apt-table-wrapper.apt-featured-table {\r\n    box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n}\r\n\r\n.apt-table-style-five .apt-featured-table {\r\n    border: 5px solid #fd8d7b;\r\n}\r\n\r\n.apt-table-style-five .apt-featured-table,\r\n.apt-table-style-six .apt-featured-table {\r\n    position: absolute;\r\n    z-index: 1;\r\n    width: 100%;\r\n}\r\n\r\n.apt-table-style-five .apt-table-wrapper.apt-featured-table header {\r\n    background-color: #F4F4F4;\r\n}\r\n\r\n.apt-table-wrapper {\r\n    transition: 0.5s all;\r\n    -webkit-transition: 0.5s all;\r\n    -moz-transition: 0.5s all;\r\n    -o-transition: 0.5s all;\r\n}\r\n\r\n    .apt-table-wrapper:hover {\r\n        box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n    }\r\n\r\n    .apt-table-wrapper header {\r\n        padding-top: 35px;\r\n    }\r\n\r\n        .apt-table-wrapper header h2 {\r\n            position: relative;\r\n            display: inline-block;\r\n            margin-bottom: 25px;\r\n            margin-top: 0px;\r\n        }\r\n\r\n        .apt-table-wrapper header h3 {\r\n            margin-top: 0px;\r\n            margin-bottom: 30px;\r\n        }\r\n\r\n.apt-style-three-header h3 {\r\n    padding-bottom: 20px;\r\n}\r\n\r\n.apt-table-icon {\r\n    padding: 40px 0px;\r\n    border-radius: 100% 100% 0% 0%;\r\n}\r\n\r\n.apt-table-content {\r\n    padding-bottom: 25px;\r\n}\r\n\r\n    .apt-table-content ul {\r\n        margin: 0;\r\n        padding: 0;\r\n        list-style: none;\r\n    }\r\n\r\n        .apt-table-content ul li {\r\n            padding: 16px 0px;\r\n        }\r\n\r\n.apt-pricing-button {\r\n    padding-bottom: 25px;\r\n}\r\n\r\n.apt-pricing-button-2 a {\r\n    display: block;\r\n    padding: 15px 30px;\r\n    text-decoration: none;\r\n    transition: all 0.9s ease 0s;\r\n    -moz-transition: all 0.9s ease 0s;\r\n    -webkit-transition: all 0.9s ease 0s;\r\n    -o-transition: all 0.9s ease 0s;\r\n    color: #FFFFFF;\r\n    background-color: #0CA579;\r\n    font-size: 16px;\r\n}\r\n\r\n@media only screen and (max-width: 767px) {\r\n    .apt-table-wrapper:hover,\r\n    .apt-table-wrapper.apt-featured-table {\r\n        transform: inherit;\r\n        -webkit-transform: inherit;\r\n        -moz-transform: inherit;\r\n        -o-transform: inherit;\r\n        -ms-transform: inherit;\r\n    }\r\n\r\n    .apt-table-wrapper {\r\n        margin-bottom: 50px;\r\n    }\r\n\r\n    .apt-table-style-five .apt-featured-table,\r\n    .apt-table-style-six .apt-featured-table {\r\n        position: inherit;\r\n    }\r\n}\r\n\r\n/*  ----------------------------------------------------\r\n13. FUN FACTS\r\n-------------------------------------------------------- */\r\n\r\n.single-fact .icon {\r\n    width: 80px;\r\n    height: 80px;\r\n    background-color: #ffffff;\r\n    line-height: 80px;\r\n    font-size: 38px;\r\n    margin: 0px auto 25px auto;\r\n    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n    color: #0CA579;\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n    border: 1px solid #dddddd;\r\n}\r\n\r\n.single-fact:hover .icon {\r\n    box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n    background-color: #0CA579;\r\n    color: #ffffff;\r\n}\r\n\r\n.single-fact .section-divider {\r\n    margin-bottom: 15px;\r\n    margin-top: 0px;\r\n}\r\n\r\n.single-fact h4 {\r\n    margin: 0px;\r\n}\r\n\r\n.features-section-2 .single-fact {\r\n    margin-top: 0px;\r\n}\r\n\r\n.single-fact-item {\r\n    padding-top: 30px;\r\n    padding-bottom: 30px;\r\n}\r\n\r\n    .single-fact-item:nth-child(-n+2) {\r\n        border-bottom: 1px solid rgba(0, 0, 0, .07);\r\n    }\r\n\r\n    .single-fact-item:nth-child(2n) {\r\n        border-left: 1px solid rgba(0, 0, 0, .07);\r\n    }\r\n\r\n/*  ----------------------------------------------------\r\n14. OUR CLIENTS\r\n-------------------------------------------------------- */\r\n.single-client {\r\n    background-color: #ffffff;\r\n    border: 1px solid rgba(0, 0, 0, .07);\r\n    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n    text-align: center;\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.white-bg .single-client {\r\n    background-color: #f4f4f4;\r\n}\r\n\r\n.single-client:hover {\r\n    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.15);\r\n}\r\n\r\n.single-client img {\r\n    -webkit-filter: grayscale(100%);\r\n    filter: grayscale(100%);\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n    padding: 20px 30px;\r\n    margin: 0 auto;\r\n}\r\n\r\n    .single-client img:hover {\r\n        -webkit-filter: grayscale(0%);\r\n        filter: grayscale(0%);\r\n    }\r\n\r\n.single-client a {\r\n    display: block;\r\n}\r\n\r\n/*  ----------------------------------------------------\r\n15. LATEST POSTS\r\n-------------------------------------------------------- */\r\n.white-bg .wrap-article {\r\n    background-color: #F4F4F4;\r\n}\r\n\r\n.wrap-article {\r\n    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n    background-color: #ffffff;\r\n    margin-bottom: 30px;\r\n    border-radius: 5px;\r\n    overflow: hidden;\r\n}\r\n\r\n    .wrap-article:hover {\r\n        box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n    }\r\n\r\n    .wrap-article .feture-image {\r\n        overflow: hidden;\r\n    }\r\n\r\n        .wrap-article .feture-image img {\r\n            text-align: center;\r\n            display: block;\r\n            margin: 0 auto;\r\n            -webkit-transition: .4s;\r\n            -o-transition: .4s;\r\n            transition: .4s;\r\n            transform: scale(1) rotate(0deg);\r\n        }\r\n\r\n    .wrap-article:hover .feture-image img {\r\n        transform: scale(1.08) rotate(2deg);\r\n    }\r\n\r\n    .wrap-article .fancy {\r\n        line-height: 0.5;\r\n        text-align: center;\r\n        font-size: 16px;\r\n        margin-top: 25px;\r\n        color: #818181;\r\n    }\r\n\r\n        .wrap-article .fancy span {\r\n            display: inline-block;\r\n            position: relative;\r\n        }\r\n\r\n            .wrap-article .fancy span:before,\r\n            .wrap-article .fancy span:after {\r\n                content: \"\";\r\n                margin-top: 1px;\r\n                position: absolute;\r\n                height: 5px;\r\n                border-top: 1px solid #dedede;\r\n                top: 0;\r\n                width: 60%;\r\n            }\r\n\r\n            .wrap-article .fancy span:before {\r\n                right: 100%;\r\n                margin-right: 5px;\r\n            }\r\n\r\n            .wrap-article .fancy span:after {\r\n                margin-left: 5px;\r\n            }\r\n\r\n.blog-details-content-wrap {\r\n    padding: 25px;\r\n}\r\n\r\n    .blog-details-content-wrap .entry-header {\r\n        margin-bottom: 20px;\r\n    }\r\n\r\n        .blog-details-content-wrap .entry-header h2 {\r\n            text-transform: uppercase;\r\n            font-size: 24px;\r\n        }\r\n\r\n.wrap-article .title {\r\n    font-size: 22px;\r\n    text-align: center;\r\n    line-height: 26px;\r\n    text-transform: uppercase;\r\n    font-weight: 700;\r\n    margin-top: 25px;\r\n    margin-bottom: 0px;\r\n    webkit-transition: all 0.4s ease-in;\r\n    -moz-transition: all 0.4s ease-in;\r\n    -o-transition: all 0.4s ease-in;\r\n    transition: all 0.4s ease-in;\r\n}\r\n\r\n.blog-meta {\r\n    overflow: hidden;\r\n}\r\n\r\n    .blog-meta span {\r\n        float: left;\r\n        margin-right: 20px;\r\n        margin-bottom: 5px;\r\n    }\r\n\r\n.wrap-article:hover a .title {\r\n    color: #0CA579;\r\n}\r\n\r\n.wrap-article .title:after {\r\n    content: \"\";\r\n    display: block;\r\n    margin: 0 auto;\r\n    bottom: -20px;\r\n    height: 1px;\r\n    background-color: #dedede;\r\n    width: 48px;\r\n    left: 0;\r\n    margin-top: 15px;\r\n}\r\n\r\n.read-more {\r\n    margin-top: 15px;\r\n    padding: 0 12px;\r\n    height: 42px;\r\n    line-height: 42px;\r\n    font-size: 14px;\r\n    font-weight: 500;\r\n}\r\n\r\n/*  ----------------------------------------------------\r\n16. TIMELINE POSTS\r\n-------------------------------------------------------- */\r\n#timeline .timeline-item:after,\r\n#timeline .timeline-item:before {\r\n    content: '';\r\n    display: block;\r\n    width: 100%;\r\n    clear: both;\r\n}\r\n\r\n.project-name {\r\n    text-align: center;\r\n    padding: 10px 0;\r\n}\r\n\r\n#timeline {\r\n    width: 100%;\r\n    position: relative;\r\n    padding: 0 10px;\r\n    -webkit-transition: all 0.4s ease;\r\n    -moz-transition: all 0.4s ease;\r\n    -ms-transition: all 0.4s ease;\r\n    transition: all 0.4s ease;\r\n}\r\n\r\n    #timeline:before {\r\n        content: \"\";\r\n        width: 3px;\r\n        height: 100%;\r\n        background-color: #0CA579;\r\n        left: 50%;\r\n        top: 0;\r\n        position: absolute;\r\n    }\r\n\r\n    #timeline:after {\r\n        content: \"\";\r\n        clear: both;\r\n        display: table;\r\n        width: 100%;\r\n    }\r\n\r\n    #timeline .timeline-item {\r\n        margin-bottom: 50px;\r\n        position: relative;\r\n    }\r\n\r\n.timeline-content img, .timeline-content .video-container {\r\n    margin-bottom: 15px;\r\n}\r\n\r\n#timeline .timeline-item:last-child {\r\n    margin-bottom: 0px;\r\n}\r\n\r\n#timeline .timeline-item .timeline-icon {\r\n    background-color: #ffffff;\r\n    width: 45px;\r\n    height: 45px;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 50%;\r\n    overflow: hidden;\r\n    transform: translate(-50%, 0);\r\n    -moz-transform: translate(-50%, 0);\r\n    -webkit-transform: translate(-50%, 0);\r\n    -o-transform: translate(-50%, 0);\r\n    -webkit-border-radius: 50%;\r\n    -moz-border-radius: 50%;\r\n    -ms-border-radius: 50%;\r\n    border-radius: 50%;\r\n    text-align: center;\r\n    line-height: 40px;\r\n    border: 3px solid #ffffff;\r\n}\r\n\r\n.white-bg #timeline .timeline-item .timeline-icon {\r\n    background-color: #F4F4F4;\r\n    border: 3px solid #F4F4F4;\r\n}\r\n\r\n#timeline .timeline-item .timeline-icon i {\r\n    font-size: 25px;\r\n    line-height: 40px;\r\n}\r\n\r\n#timeline .timeline-item .timeline-icon img {\r\n    border-radius: 50%;\r\n}\r\n\r\n#timeline .timeline-item .timeline-content {\r\n    width: 45%;\r\n    background-color: #fff;\r\n    padding: 20px;\r\n    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n    -webkit-border-radius: 5px;\r\n    -moz-border-radius: 5px;\r\n    -ms-border-radius: 5px;\r\n    border-radius: 5px;\r\n    -webkit-transition: all 0.3s ease;\r\n    -moz-transition: all 0.3s ease;\r\n    -ms-transition: all 0.3s ease;\r\n    transition: all 0.3s ease;\r\n    overflow: hidden;\r\n}\r\n\r\n.white-bg #timeline .timeline-item .timeline-content {\r\n    background-color: #F4F4F4;\r\n}\r\n\r\n#timeline .timeline-item .timeline-content:hover {\r\n    box-shadow: 0 8px 48px 0 rgba(0, 0, 0, 0.15);\r\n}\r\n\r\n#timeline .timeline-item .timeline-content .title {\r\n    padding: 10px;\r\n    background-color: #0CA579;\r\n    color: #fff;\r\n    margin: -20px -20px 20px -20px;\r\n    font-size: 18px;\r\n    font-weight: 600;\r\n    -webkit-border-radius: 3px 3px 0 0;\r\n    -moz-border-radius: 3px 3px 0 0;\r\n    -ms-border-radius: 3px 3px 0 0;\r\n    border-radius: 3px 3px 0 0;\r\n}\r\n\r\n#timeline .timeline-item .timeline-content:before {\r\n    content: '';\r\n    position: absolute;\r\n    left: 45%;\r\n    top: 15px;\r\n    width: 0;\r\n    height: 0;\r\n    border-top: 7px solid transparent;\r\n    border-bottom: 7px solid transparent;\r\n    border-left: 7px solid #0CA579;\r\n}\r\n\r\n#timeline .timeline-item .timeline-content.right {\r\n    float: right;\r\n}\r\n\r\n    #timeline .timeline-item .timeline-content.right:before {\r\n        content: '';\r\n        right: 45%;\r\n        left: inherit;\r\n        border-left: 0;\r\n        border-right: 7px solid #0CA579;\r\n    }\r\n\r\n@media screen and (max-width: 768px) {\r\n    #timeline {\r\n        margin: 30px;\r\n        padding: 0px;\r\n        width: 90%;\r\n    }\r\n\r\n        #timeline:before {\r\n            left: 0;\r\n        }\r\n\r\n        #timeline .timeline-item .timeline-content {\r\n            width: 90%;\r\n            float: right;\r\n        }\r\n\r\n            #timeline .timeline-item .timeline-content:before,\r\n            #timeline .timeline-item .timeline-content.right:before {\r\n                left: 10%;\r\n                margin-left: -6px;\r\n                border-left: 0;\r\n                border-right: 7px solid #0CA579;\r\n            }\r\n\r\n        #timeline .timeline-item .timeline-icon {\r\n            left: 0;\r\n        }\r\n}\r\n\r\n/*  ----------------------------------------------------\r\n17. TIMELINE EDUCATION AND EXPIREANCE\r\n-------------------------------------------------------- */\r\n#timeline.edu-ex-timeline {\r\n    margin: 30px;\r\n    padding: 0px;\r\n    width: 90%;\r\n}\r\n\r\n    #timeline.edu-ex-timeline:before {\r\n        left: 0;\r\n    }\r\n\r\n    #timeline.edu-ex-timeline .timeline-item .timeline-content {\r\n        width: 90%;\r\n        float: right;\r\n    }\r\n\r\n        #timeline.edu-ex-timeline .timeline-item .timeline-content:before,\r\n        #timeline.edu-ex-timeline .timeline-item .timeline-content.right:before {\r\n            left: 10%;\r\n            margin-left: -6px;\r\n            border-left: 0;\r\n            border-right: 7px solid #0CA579;\r\n        }\r\n\r\n    #timeline.edu-ex-timeline .timeline-item .timeline-icon {\r\n        left: 0;\r\n    }\r\n\r\n.item-period,\r\n.item-small {\r\n    display: inline-block;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.item-period {\r\n    color: #0CA579;\r\n    font-weight: 700;\r\n}\r\n\r\n.item-small {\r\n    margin-left: 5px;\r\n    padding-left: 5px;\r\n    border-left: 1px solid #F4F4F4;\r\n}\r\n\r\n#timeline.edu-ex-timeline p {\r\n    margin-bottom: 0px;\r\n}\r\n\r\n/*  ----------------------------------------------------\r\n18. CONTACT SECTION\r\n-------------------------------------------------------- */\r\n.gray-bg .contact-form-box,\r\n.gray-bg .contact-info-box {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.contact-form-box,\r\n.contact-info-box {\r\n    background-color: #F4F4F4;\r\n    padding-top: 25px;\r\n    padding-bottom: 28px;\r\n    padding-left: 15px;\r\n    padding-right: 15px;\r\n    overflow: hidden;\r\n}\r\n\r\n    .contact-info-box.our-skills-box {\r\n        padding-bottom: 35px;\r\n    }\r\n\r\n    .contact-info-box h4 {\r\n        font-size: 18px;\r\n    }\r\n/* - 18-1 CONTACT MESSAGE */\r\n.email-success,\r\n.email-failed,\r\n.email-loading,\r\n.success-msg,\r\n.error-msg {\r\n    font-size: 15px;\r\n    text-align: center;\r\n    padding: 10px;\r\n    display: none;\r\n    margin: 0px !important;\r\n}\r\n\r\n.email-loading {\r\n    color: #52B8FF;\r\n}\r\n\r\n    .email-loading img {\r\n        width: 15px;\r\n        position: relative;\r\n        top: -2px;\r\n    }\r\n\r\n.email-failed,\r\n.error-msg {\r\n    color: #FF5252 !important;\r\n}\r\n\r\n    .email-failed .icon {\r\n        font-size: 20px;\r\n        position: relative;\r\n        top: 5px;\r\n    }\r\n\r\n.email-success,\r\n.success-msg {\r\n    color: #56CC35;\r\n}\r\n\r\n    .email-failed .icon,\r\n    .email-success .icon,\r\n    .error-msg .icon,\r\n    .success-msg .icon {\r\n        font-size: 20px;\r\n        position: relative;\r\n        top: 2px;\r\n    }\r\n\r\n/* - 18-2 FORM STYLE */\r\n.contact-form-box input,\r\n.contact-form-box textarea {\r\n    width: 100%;\r\n    border: none;\r\n    padding-left: 5px;\r\n    padding-top: 5px;\r\n    background-color: #ffffff;\r\n    border-bottom: 1px solid #d1d1d1;\r\n    font-weight: 500;\r\n    margin-bottom: 0px;\r\n}\r\n\r\n.gray-bg .contact-form-box input,\r\n.gray-bg .contact-form-box textarea {\r\n    background-color: #F4F4F4;\r\n}\r\n\r\n.contact-form-box textarea {\r\n    min-height: 120px;\r\n    webkit-transition: all 0.3s ease-in-out;\r\n    -webkit-transition: all 0.3s ease-in-out;\r\n    transition: all 0.3s ease-in-out;\r\n}\r\n\r\n    .contact-form-box textarea:focus {\r\n        border: none;\r\n        border-bottom: 2px solid #0CA579;\r\n    }\r\n\r\n/* Social icons */\r\n.social-bookmark {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\r\n}\r\n\r\n    .social-bookmark li {\r\n        display: inline;\r\n    }\r\n\r\n    .social-bookmark a {\r\n        display: inline-block;\r\n        text-align: center;\r\n        margin-right: 5px;\r\n        margin-left: 5px;\r\n        margin-bottom: 10px;\r\n        background-color: #0CA579;\r\n        color: #ffffff;\r\n        width: 40px;\r\n        height: 40px;\r\n        line-height: 40px;\r\n        font-size: 18px;\r\n        border: 1px solid transparent;\r\n    }\r\n\r\n        .social-bookmark a:hover {\r\n            background-color: transparent;\r\n            border: 1px dashed #32BEF2;\r\n            color: #0CA579;\r\n        }\r\n\r\n/*  ----------------------------------------------------\r\n19. TABS\r\n-------------------------------------------------------- */\r\n.collapsible-header h5 {\r\n    margin: 0px;\r\n    line-height: 3rem;\r\n    font-size: 16px;\r\n}\r\n\r\n.tabs {\r\n    background-color: #0CA579;\r\n}\r\n\r\n    .tabs .tab a,\r\n    .tabs .tab a:hover,\r\n    .tabs .tab a.active {\r\n        font-family: 'Quicksand', sans-serif;\r\n        color: #ffffff;\r\n        font-weight: 700;\r\n    }\r\n\r\n        .tabs .tab a.active {\r\n            background-color: #0096CE;\r\n        }\r\n\r\n.single-tab-content {\r\n    background-color: #ffffff;\r\n    padding: 15px;\r\n}\r\n\r\n.gray-bg .single-tab-content {\r\n    background-color: #F4F4F4;\r\n}\r\n\r\n/* -19.1 FREQUENTLY ASK QUESTIONS */\r\n.wrap {\r\n    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);\r\n    border-radius: 4px;\r\n}\r\n\r\n.panel {\r\n    border-width: 0 0 1px 0;\r\n    border-style: solid;\r\n    border-color: #fff;\r\n    background-color: none;\r\n    box-shadow: none;\r\n}\r\n\r\n    .panel:last-child {\r\n        border-bottom: none;\r\n    }\r\n\r\n.panel-group > .panel:first-child .panel-heading {\r\n    border-radius: 4px 4px 0 0;\r\n}\r\n\r\n.panel-group .panel {\r\n    border-radius: 0;\r\n}\r\n\r\n    .panel-group .panel + .panel {\r\n        margin-top: 0;\r\n    }\r\n\r\n.panel-heading {\r\n    background-color: #0CA579;\r\n    border-radius: 0;\r\n    border: none;\r\n    color: #fff;\r\n    padding: 0;\r\n    webkit-transition: all 0.3s ease-in-out;\r\n    -webkit-transition: all 0.3s ease-in-out;\r\n    transition: all 0.3s ease-in-out;\r\n}\r\n\r\n    .panel-heading:hover {\r\n        opacity: 0.8;\r\n    }\r\n\r\n.panel-title a {\r\n    display: block;\r\n    color: #fff;\r\n    padding: 15px;\r\n    position: relative;\r\n    font-size: 16px;\r\n    font-weight: 600;\r\n    padding-right: 30px;\r\n}\r\n\r\n.panel-body {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.bg-gray .panel-body {\r\n    background-color: #fff;\r\n}\r\n\r\n.panel:last-child .panel-body {\r\n    border-radius: 0 0 4px 4px;\r\n}\r\n\r\n.panel:last-child .panel-heading {\r\n    border-radius: 0 0 4px 4px;\r\n    -webkit-transition: border-radius 0.3s linear 0.2s;\r\n    transition: border-radius 0.3s linear 0.2s;\r\n}\r\n\r\n    .panel:last-child .panel-heading.active {\r\n        border-radius: 0;\r\n        -webkit-transition: border-radius linear 0s;\r\n        transition: border-radius linear 0s;\r\n    }\r\n\r\n.panel-heading a:before {\r\n    content: '\\F106';\r\n    position: absolute;\r\n    font-family: 'FontAwesome';\r\n    right: 5px;\r\n    top: 10px;\r\n    font-size: 24px;\r\n    -webkit-transition: all 0.5s;\r\n    transition: all 0.5s;\r\n    -webkit-transform: scale(1);\r\n    transform: scale(1);\r\n}\r\n\r\n.panel-heading.active a:before {\r\n    content: ' ';\r\n    -webkit-transition: all 0.5s;\r\n    transition: all 0.5s;\r\n    -webkit-transform: scale(0);\r\n    transform: scale(0);\r\n}\r\n\r\n.collapsible {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\r\n}\r\n\r\n#bs-collapse .panel-heading a:after {\r\n    content: ' ';\r\n    font-size: 24px;\r\n    position: absolute;\r\n    font-family: 'FontAwesome';\r\n    right: 5px;\r\n    top: 10px;\r\n    -webkit-transform: scale(0);\r\n    transform: scale(0);\r\n    -webkit-transition: all 0.5s;\r\n    transition: all 0.5s;\r\n}\r\n\r\n#bs-collapse .panel-heading.active a:after {\r\n    content: '\\F106';\r\n    -webkit-transform: scale(1);\r\n    transform: scale(1);\r\n    -webkit-transition: all 0.5s;\r\n    transition: all 0.5s;\r\n}\r\n\r\n#accordion .panel-heading a:before {\r\n    content: '\\F106';\r\n    font-size: 24px;\r\n    position: absolute;\r\n    font-family: 'FontAwesome';\r\n    right: 5px;\r\n    top: 10px;\r\n    -webkit-transform: rotate(180deg);\r\n    transform: rotate(180deg);\r\n    -webkit-transition: all 0.5s;\r\n    transition: all 0.5s;\r\n}\r\n\r\n#accordion .panel-heading.active a:before {\r\n    -webkit-transform: rotate(0deg);\r\n    transform: rotate(0deg);\r\n    -webkit-transition: all 0.5s;\r\n    transition: all 0.5s;\r\n}\r\n\r\n#accordion a:hover,\r\n#accordion a:focus {\r\n    color: #ffffff;\r\n    text-decoration: none;\r\n}\r\n/*  ----------------------------------------------------\r\n20. PROGRESS BARS\r\n-------------------------------------------------------- */\r\n.progress-bars .progress {\r\n    position: relative;\r\n    height: auto;\r\n    margin-bottom: 0;\r\n    background-color: transparent;\r\n    border-radius: 0;\r\n    box-shadow: none;\r\n    overflow: visible;\r\n    z-index: 0;\r\n}\r\n\r\n    .progress-bars .progress + .progress {\r\n        margin-top: 17px;\r\n    }\r\n\r\n    .progress-bars .progress:before {\r\n        content: \" \";\r\n        position: absolute;\r\n        left: 0;\r\n        right: 0;\r\n        bottom: 0;\r\n        height: 6px;\r\n        background-color: #fafafa;\r\n        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);\r\n    }\r\n\r\n    .progress-bars .progress p {\r\n        margin-bottom: 8px;\r\n        font-size: 14px;\r\n        line-height: 24px;\r\n    }\r\n\r\n    .progress-bars .progress .progress-bar {\r\n        float: none;\r\n        position: relative;\r\n        min-width: 40px;\r\n        height: 6px;\r\n        background-color: #0CA579;\r\n        box-shadow: none;\r\n        font-size: 14px;\r\n        line-height: 22px;\r\n        -webkit-transition: width 1s ease-in-out .3s;\r\n        transition: width 1s ease-in-out .3s;\r\n    }\r\n\r\n        .progress-bars .progress .progress-bar span {\r\n            display: block;\r\n            position: absolute;\r\n            top: 50%;\r\n            right: 0;\r\n            width: 40px;\r\n            margin-top: -17px;\r\n            padding: 5px 0;\r\n            background-color: #fff;\r\n            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);\r\n            font-weight: 500;\r\n            text-align: center;\r\n            color: #525252\r\n        }\r\n\r\n.call-to-action h3 {\r\n    color: #ffffff;\r\n}\r\n\r\n.cta-wrap {\r\n    overflow: hidden;\r\n}\r\n/*  ----------------------------------------------------\r\n21. SINGLE BLOG\r\n-------------------------------------------------------- */\r\nblockquote {\r\n    border-color: #0CA579;\r\n    background-color: #f4f4f4;\r\n}\r\n\r\n.white-bg blockquote {\r\n    background: #ffffff;\r\n}\r\n\r\ntable {\r\n    background-color: #f4f4f4;\r\n}\r\n\r\n.white-bg table {\r\n    background-color: #ffffff;\r\n}\r\n\r\ntable tr th,\r\ntable tr td {\r\n    border: 1px solid #ccc;\r\n    text-align: center;\r\n}\r\n\r\ntable {\r\n    margin-bottom: 15px;\r\n}\r\n\r\ndd {\r\n    margin-bottom: 5px;\r\n}\r\n\r\ncite {\r\n    display: block;\r\n    font-weight: 600;\r\n}\r\n\r\nstrong {\r\n    font-weight: 600;\r\n}\r\n\r\nul,\r\nol {\r\n    padding-left: 30px;\r\n}\r\n\r\n.single-article:hover {\r\n    box-shadow: inherit;\r\n}\r\n\r\n.single-article p {\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.author-box {\r\n    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n    transition: all 0.3s;\r\n    padding: 30px 20px;\r\n    background-color: #ffffff;\r\n    margin-bottom: 30px;\r\n    overflow: hidden;\r\n    border-radius: 5px;\r\n}\r\n\r\n.avatar {\r\n    float: left;\r\n    margin-right: 15px;\r\n    padding: 5px;\r\n    background-color: #ffffff;\r\n    border: 1px solid #f4f4f4;\r\n}\r\n\r\n.author .avatar-70 {\r\n    width: 100px;\r\n}\r\n\r\n.avatar-70 {\r\n    width: 70px;\r\n}\r\n\r\n.comment-navigation {\r\n    background: #0CA579;\r\n}\r\n\r\n.blog-comment {\r\n    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n    padding: 30px 20px;\r\n    background-color: #ffffff;\r\n    margin-bottom: 30px;\r\n    border-radius: 5px;\r\n}\r\n\r\n.comment-list {\r\n    list-style: none;\r\n}\r\n\r\nul.comment-list:not(.browser-default) {\r\n    padding: 0px;\r\n}\r\n\r\n.comment-list {\r\n    list-style: none;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n    .comment-list .the-comment {\r\n        border-bottom: 1px solid #f4f4f4;\r\n        padding-bottom: 25px;\r\n        margin-bottom: 25px;\r\n    }\r\n\r\n    .comment-list .children {\r\n        list-style: none;\r\n    }\r\n\r\n.post-comment-form-group textarea {\r\n    width: 100%;\r\n}\r\n\r\n    .post-comment-form-group textarea:focus {\r\n        border-color: #0CA579;\r\n        outline: 0;\r\n        box-shadow: none;\r\n    }\r\n\r\n.comment-form textarea {\r\n    margin-bottom: 15px;\r\n}\r\n\r\n/* -21.1 BLOG SIDEBAR */\r\n.sidebar {\r\n    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n    webkit-transition: all 0.4s ease-in-out;\r\n    -moz-transition: all 0.4s ease-in-out;\r\n    -o-transition: all 0.4s ease-in-out;\r\n    transition: all 0.4s ease-in-out;\r\n    padding: 30px 20px;\r\n    background-color: #ffffff;\r\n    margin-bottom: 30px;\r\n    overflow: hidden;\r\n}\r\n\r\n.white-bg .sidebar {\r\n    background-color: #F4F4F4;\r\n}\r\n\r\n.sidebar .widget {\r\n    margin-bottom: 30px;\r\n}\r\n\r\n    .sidebar .widget ul {\r\n        margin: 0px;\r\n        padding: 0px;\r\n        list-style: none;\r\n    }\r\n\r\n    .sidebar .widget li {\r\n        border-bottom: 1px solid #f4f4f4;\r\n        position: relative;\r\n        padding-left: 20px;\r\n    }\r\n\r\n        .sidebar .widget li::before {\r\n            content: \"\\F101\";\r\n            position: absolute;\r\n            left: 0px;\r\n            top: 5px;\r\n            font-family: FontAwesome;\r\n            webkit-transition: all 0.4s ease-in-out;\r\n            -moz-transition: all 0.4s ease-in-out;\r\n            -o-transition: all 0.4s ease-in-out;\r\n            transition: all 0.4s ease-in-out;\r\n        }\r\n\r\n        .sidebar .widget li:hover::before {\r\n            left: 5px;\r\n        }\r\n\r\n        .sidebar .widget li:last-child {\r\n            border: none;\r\n        }\r\n\r\n.white-bg .sidebar .widget li {\r\n    border-bottom-color: #ffffff;\r\n}\r\n\r\n.sidebar .widget li a {\r\n    margin-top: 5px;\r\n    margin-bottom: 5px;\r\n    font-size: 16px;\r\n    line-height: 25px;\r\n    display: inline-block;\r\n    color: #525252;\r\n}\r\n\r\n    .sidebar .widget li a:hover {\r\n        color: #0CA579\r\n    }\r\n\r\n.sidebar .widget:last-child {\r\n    margin-bottom: 0px;\r\n}\r\n\r\n.sidebar .widget .tag-cloud li {\r\n    border: none;\r\n    margin: 0;\r\n    display: inline;\r\n    padding: 0;\r\n}\r\n\r\n    .sidebar .widget .tag-cloud li:before {\r\n        position: inherit;\r\n        content: \"\";\r\n    }\r\n\r\n    .sidebar .widget .tag-cloud li a {\r\n        display: inline-block;\r\n        background-color: #000;\r\n        color: #ffffff;\r\n        padding: 2px 5px;\r\n        margin-right: 5px;\r\n        margin-top: 10px;\r\n        font-size: 12px;\r\n    }\r\n\r\n        .sidebar .widget .tag-cloud li a:hover {\r\n            background-color: #38A6F1;\r\n            color: #ffffff;\r\n        }\r\n\r\n/*  ----------------------------------------------------\r\n22. ABOUT PAGE\r\n-------------------------------------------------------- */\r\n.about-intro-text {\r\n    padding-left: 15px;\r\n    padding-top: 22px;\r\n}\r\n\r\n    .about-intro-text h3 {\r\n        font-size: 24px;\r\n    }\r\n\r\n.video-icon {\r\n    width: 100%;\r\n    height: 100%;\r\n    text-align: center;\r\n    position: relative;\r\n}\r\n\r\n    .video-icon button {\r\n        font-size: 55px;\r\n        vertical-align: middle;\r\n        position: absolute;\r\n        top: 50%;\r\n        transform: translate(-50%, -50%);\r\n        -moz-transform: translate(-50%, -50%);\r\n        -webkit-transform: translate(-50%, -50%);\r\n        -o-transform: translate(-50%, -50%);\r\n        background-color: none;\r\n        border: none;\r\n        color: #0CA579;\r\n        background-color: transparent;\r\n    }\r\n\r\n/*  ----------------------------------------------------\r\n23. CONTACT PAGES\r\n-------------------------------------------------------- */\r\n/* CONTACT PAGE 1 */\r\n.gmap3 {\r\n    width: 100%;\r\n    height: 500px;\r\n}\r\n\r\n.left-icon-box {\r\n    padding: 15px;\r\n    padding-left: 115px;\r\n    position: relative;\r\n    background-color: #ffffff;\r\n    box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.05);\r\n}\r\n\r\n    .left-icon-box .icon {\r\n        position: absolute;\r\n        left: 15px;\r\n        top: 15px;\r\n        width: 80px;\r\n        height: 80px;\r\n        text-align: center;\r\n        line-height: 80px;\r\n        border: 1px solid #f1f1f1;\r\n        border-radius: 50%;\r\n        font-size: 35px;\r\n        color: #0CA579;\r\n        webkit-transition: all 0.4s ease-in-out;\r\n        -moz-transition: all 0.4s ease-in-out;\r\n        -o-transition: all 0.4s ease-in-out;\r\n        transition: all 0.4s ease-in-out;\r\n    }\r\n\r\n    .left-icon-box:hover .icon {\r\n        background-color: #0CA579;\r\n        color: #ffffff;\r\n    }\r\n\r\n.white-bg .left-icon-box {\r\n    background-color: #f1f1f1;\r\n}\r\n\r\n.left-icon-box h5 {\r\n    font-size: 20px;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.left-icon-box p {\r\n    margin-bottom: 0px;\r\n}\r\n/*  ----------------------------------------------------\r\n24. 404 PAGES\r\n-------------------------------------------------------- */\r\n.error_content_inner {\r\n    position: relative;\r\n}\r\n\r\n    .error_content_inner h1 {\r\n        font-size: 180px;\r\n        color: #0CA579;\r\n        font-weight: 700;\r\n        margin: 0px;\r\n        padding: 0px;\r\n    }\r\n\r\n    .error_content_inner p {\r\n        margin-bottom: 30px;\r\n        font-size: 18px;\r\n        line-height: 26px;\r\n    }\r\n\r\n    .error_content_inner h3 {\r\n        font-size: 50px;\r\n        font-weight: 500;\r\n        letter-spacing: 1.5px;\r\n        margin-bottom: 50px;\r\n        padding: 0px;\r\n    }\r\n\r\n    .error_content_inner h6 {\r\n        margin-top: 50px;\r\n        margin-bottom: 30px;\r\n        margin-bottom: 0px;\r\n        font-weight: 400;\r\n    }\r\n/*  ----------------------------------------------------\r\n25. COMING SOON PAGES\r\n-------------------------------------------------------- */\r\n.coming-soon-wrap {\r\n    height: 100vh;\r\n    position: relative;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n    .coming-soon-wrap .features-item {\r\n        margin-top: 25px;\r\n    }\r\n\r\n.coming_content_inner {\r\n    overflow: hidden;\r\n}\r\n\r\n    .coming_content_inner h1 {\r\n        font-size: 55px;\r\n        margin-bottom: 30px\r\n    }\r\n\r\n    .coming_content_inner .countdown {\r\n        margin: 0;\r\n        padding: 0;\r\n        list-style: none;\r\n        text-align: center;\r\n    }\r\n\r\n        .coming_content_inner .countdown li {\r\n            display: inline-block;\r\n            padding: 15px\r\n        }\r\n\r\n            .coming_content_inner .countdown li span {\r\n                font-size: 55px;\r\n                font-weight: 700;\r\n                line-height: 65px;\r\n            }\r\n\r\n            .coming_content_inner .countdown li p {\r\n                font-size: 22px;\r\n            }\r\n\r\n/*  ----------------------------------------------------\r\n26. FOOTER\r\n-------------------------------------------------------- */\r\n\r\n#footer {\r\n    background-color: #000000;\r\n    background-position: center center;\r\n    background-attachment: fixed;\r\n    background-size: cover;\r\n}\r\n\r\n.footer-wrap,\r\n.footer-top {\r\n    background-color: rgba(38, 39, 50, 0.85);\r\n}\r\n\r\n.footer-col {\r\n    padding: 40px 0px 40px 0px;\r\n    color: #ffffff;\r\n}\r\n\r\n    .footer-col ul {\r\n        list-style: none;\r\n        margin: 0;\r\n        padding: 0;\r\n    }\r\n\r\n        .footer-col ul li {\r\n            position: relative;\r\n            padding-left: 20px;\r\n        }\r\n\r\n    .footer-col li:before {\r\n        content: \"\\F101\";\r\n        position: absolute;\r\n        left: 0;\r\n        top: 0px;\r\n        color: #ffffff;\r\n        font-family: 'FontAwesome';\r\n        webkit-transition: all 0.4s ease-in-out;\r\n        -moz-transition: all 0.4s ease-in-out;\r\n        -o-transition: all 0.4s ease-in-out;\r\n        transition: all 0.4s ease-in-out;\r\n    }\r\n\r\n    .footer-col li:hover:before {\r\n        left: 3px;\r\n        webkit-transition: all 0.4s ease-in-out;\r\n        -moz-transition: all 0.4s ease-in-out;\r\n        -o-transition: all 0.4s ease-in-out;\r\n        transition: all 0.4s ease-in-out;\r\n        color: #0CA579;\r\n    }\r\n\r\n    .footer-col h6 {\r\n        font-size: 20px;\r\n        text-transform: uppercase;\r\n        color: #ffffff;\r\n        margin-bottom: 20px;\r\n    }\r\n\r\n    .footer-col p,\r\n    .footer-col ul {\r\n        font-size: 16px;\r\n        line-height: 30px;\r\n    }\r\n\r\n    .footer-col a {\r\n        color: #ffffff;\r\n    }\r\n\r\n        .footer-col a:hover {\r\n            color: #0CA579\r\n        }\r\n\r\n.footer-logo {\r\n    margin-top: 38px;\r\n}\r\n\r\n    .footer-logo img {\r\n        margin: 0 auto;\r\n    }\r\n\r\n.footer-copyright {\r\n    color: #ffffff;\r\n    padding-top: 15px;\r\n    padding-bottom: 15px;\r\n    overflow: hidden;\r\n}\r\n\r\n    .footer-copyright p {\r\n        margin-bottom: 0px;\r\n    }\r\n\r\n    .footer-copyright a:hover {\r\n        color: #f8f8f8;\r\n    }\r\n\r\n.thead-dark {\r\n    border-top-style: solid;\r\n    border-top-color: #0CA579;\r\n}\r\n\r\ndl {\r\n    overflow: auto;\r\n    text-align: left;\r\n}\r\n\r\ndt {\r\n    float: left;\r\n    clear: left;\r\n    margin: 0;\r\n    width: 130px;\r\n}\r\n\r\ndt.tokens {\r\n    width: 120px!important;\r\n}\r\n\r\ndd {\r\n    margin: 0;\r\n    overflow: auto;\r\n}\r\n\r\n.loading-content{\r\n    min-height: 250px;\r\n}\r\n\r\n.gridlink {\r\n    color: #525252;\r\n    text-decoration:underline;\r\n}\r\n    .gridlink:hover {\r\n        color: #0CA579;\r\n        text-decoration: underline;\r\n    }\r\n.tx-in, .tx-out {\r\n    color: #ffffff;\r\n    letter-spacing: 0.6px;\r\n    padding: 1px 10px;\r\n    -webkit-border-radius: 10px;\r\n    -moz-border-radius: 10px;\r\n    -ms-border-radius: 10px;\r\n    -o-border-radius: 10px;\r\n    border-radius: 10px;\r\n    font-size: 12px;\r\n}\r\n.tx-in {\r\n    background-color: #0CA579;\r\n}\r\n.tx-out {\r\n    background-color: #f4516c;\r\n}\r\n\r\n.paging-btn {\r\n    position: relative;\r\n    display: block;\r\n    padding: 0.5rem 0.75rem;\r\n    margin-left: 10px;\r\n    line-height: 1.25;\r\n    color: #0CA579;\r\n    background-color: #fff;\r\n    border: 1px solid #ddd;\r\n}\r\n\r\n.nav-tabs {\r\n    border-top-style: solid;\r\n    border-top-color: #0ca579;\r\n\r\n}\r\n.tab-pane {\r\n    padding-top: 15px;\r\n    padding-bottom: 15px;\r\n    padding-left: 25px;\r\n    padding-right: 25px;\r\n}\r\n\r\n.tab-content {\r\n    border-bottom: 1px solid #ddd;\r\n    border-right: 1px solid #ddd;\r\n    border-left: 1px solid #ddd;\r\n}\r\n\r\n.tabsContainer {\r\n    background-color: #fff;\r\n}\r\n\r\n.tab-pane dl dt {\r\n    width: 150px !important;\r\n}\r\n\r\n.tokenBalance{\r\n    height:32px;\r\n}\r\n\r\n.blockPending{\r\n    height:18px;\r\n    width: 18px;\r\n    padding-left:0px!important;\r\n    padding-right:0px!important;\r\n}\r\n\r\nh4 {\r\n    overflow: hidden;\r\n}\r\n\r\n.export-btn {\r\n    text-decoration: none;\r\n    color: #fff;\r\n    background-color: #0CA579;\r\n    text-align: center;\r\n    letter-spacing: .5px;\r\n    transition: .2s ease-out;\r\n    cursor: pointer;\r\n    padding: 10px;\r\n    margin-right:5px;\r\n}\r\n\r\n.identicon {\r\n    display: block;\r\n    margin: auto;\r\n}", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)();
// imports


// module
exports.push([module.i, "\n.main-nav li .glyphicon {\r\n    margin-right: 10px;\n}\r\n\r\n/* Highlighting rules for nav menu items */\n.main-nav li a.router-link-active,\r\n.main-nav li a.router-link-active:hover,\r\n.main-nav li a.router-link-active:focus {\r\n    background-color: #4189C7;\r\n    color: white;\n}\r\n\r\n/* Keep the nav menu independent of scrolling and on top of other items */\n.main-nav {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 1;\n}\n@media (min-width: 768px) {\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\n.main-nav {\r\n        height: 100%;\r\n        width: calc(25% - 20px);\n}\n.main-nav .navbar {\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\n}\n.main-nav .navbar-header {\r\n        float: none;\n}\n.main-nav .navbar-collapse {\r\n        border-top: 1px solid #444;\r\n        padding: 0px;\n}\n.main-nav .navbar ul {\r\n        float: none;\n}\n.main-nav .navbar li {\r\n        float: none;\r\n        font-size: 15px;\r\n        margin: 6px;\n}\n.main-nav .navbar li a {\r\n        padding: 10px 16px;\r\n        border-radius: 4px;\n}\n.main-nav .navbar a {\r\n        /* If a menu item's text is too long, truncate it */\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\n}\n}\r\n", "", {"version":3,"sources":["/./ClientApp/components/navmenu/navmenu.css"],"names":[],"mappings":";AAAA;IACI,mBAAmB;CACtB;;AAED,2CAA2C;AAC3C;;;IAGI,0BAA0B;IAC1B,aAAa;CAChB;;AAED,0EAA0E;AAC1E;IACI,gBAAgB;IAChB,OAAO;IACP,QAAQ;IACR,SAAS;IACT,WAAW;CACd;AAED;IACI,kEAAkE;AAClE;QACI,aAAa;QACb,wBAAwB;CAC3B;AACD;QACI,mBAAmB;QACnB,kBAAkB;QAClB,aAAa;CAChB;AACD;QACI,YAAY;CACf;AACD;QACI,2BAA2B;QAC3B,aAAa;CAChB;AACD;QACI,YAAY;CACf;AACD;QACI,YAAY;QACZ,gBAAgB;QAChB,YAAY;CACf;AACD;QACI,mBAAmB;QACnB,mBAAmB;CACtB;AACD;QACI,oDAAoD;QACpD,YAAY;QACZ,oBAAoB;QACpB,iBAAiB;QACjB,wBAAwB;CAC3B;CACJ","file":"navmenu.css","sourcesContent":[".main-nav li .glyphicon {\r\n    margin-right: 10px;\r\n}\r\n\r\n/* Highlighting rules for nav menu items */\r\n.main-nav li a.router-link-active,\r\n.main-nav li a.router-link-active:hover,\r\n.main-nav li a.router-link-active:focus {\r\n    background-color: #4189C7;\r\n    color: white;\r\n}\r\n\r\n/* Keep the nav menu independent of scrolling and on top of other items */\r\n.main-nav {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 1;\r\n}\r\n\r\n@media (min-width: 768px) {\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\r\n    .main-nav {\r\n        height: 100%;\r\n        width: calc(25% - 20px);\r\n    }\r\n    .main-nav .navbar {\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\r\n    }\r\n    .main-nav .navbar-header {\r\n        float: none;\r\n    }\r\n    .main-nav .navbar-collapse {\r\n        border-top: 1px solid #444;\r\n        padding: 0px;\r\n    }\r\n    .main-nav .navbar ul {\r\n        float: none;\r\n    }\r\n    .main-nav .navbar li {\r\n        float: none;\r\n        font-size: 15px;\r\n        margin: 6px;\r\n    }\r\n    .main-nav .navbar li a {\r\n        padding: 10px 16px;\r\n        border-radius: 4px;\r\n    }\r\n    .main-nav .navbar a {\r\n        /* If a menu item's text is too long, truncate it */\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\r\n    }\r\n}\r\n"],"sourceRoot":"webpack://"}]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_site_css__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_site_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_site_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_bootnav_css__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_bootnav_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__css_bootnav_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__css_font_awesome_css__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__css_font_awesome_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__css_font_awesome_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bootstrap__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vue_router__ = __webpack_require__(72);
﻿






__WEBPACK_IMPORTED_MODULE_4_vue__["default"].config.devtools = true;
__WEBPACK_IMPORTED_MODULE_4_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_5_vue_router__["default"]);

const routes = [
    { path: '/', component: __webpack_require__(44) },

    { path: '/account/:address', component: __webpack_require__(40), name: 'account' },
    { path: '/block/:blockNumber', component: __webpack_require__(42), name: 'block', alias: '/block/1' },
    { path: '/blocks', component: __webpack_require__(45), name: 'blocks' },
    { path: '/transactions', component: __webpack_require__(46), name: 'transactions' },
    { path: '/pendingtransactions', component: __webpack_require__(49), name: 'pendingtransactions' },
    { path: '/transaction/:transactionHash', component: __webpack_require__(51), name: 'transaction' },
    { path: '/tokens', component: __webpack_require__(50), name: 'tokens' },
    { path: '/miningpools', component: __webpack_require__(47), name: 'miningpools' },
    
];

new __WEBPACK_IMPORTED_MODULE_4_vue__["default"]({
    el: '#app-root',
    router: new __WEBPACK_IMPORTED_MODULE_5_vue_router__["default"]({ mode: 'history', routes: routes }),
    render: function(r) { return r(__webpack_require__(41)); }
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: ''
};
if (true) {
  var querystring = __webpack_require__(33);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }
  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  connect();
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(35);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(67);
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(68);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    }
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?path=__webpack_hmr&dynamicPublicPath=true", __webpack_require__(69)(module)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(2);

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var AccountComponent = (function (_super) {
    __extends(AccountComponent, _super);
    function AccountComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pageNumber = 1;
        _this.transactions = [];
        return _this;
    }
    AccountComponent.prototype.data = function () {
        return {
            account: null
        };
    };
    AccountComponent.prototype.navigate = function (address) {
        this.pageNumber = 1;
        this.$router.push({ name: 'account', params: { address: address } });
        this.address = address;
        window.scrollTo(0, 0);
        this.loadData();
    };
    AccountComponent.prototype.previousPage = function () {
        var _this = this;
        if (this.pageNumber > 1)
            this.pageNumber--;
        fetch('internalapi/Account/GetTransactions?address=' + this.address + '&pageNumber=' + this.pageNumber)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.transactions = data;
        });
    };
    AccountComponent.prototype.nextPage = function () {
        var _this = this;
        this.pageNumber++;
        fetch('internalapi/Account/GetTransactions?address=' + this.address + '&pageNumber=' + this.pageNumber)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.transactions = data;
        });
    };
    AccountComponent.prototype.mounted = function () {
        this.address = this.$route.params.address;
        this.loadData();
    };
    AccountComponent.prototype.loadData = function () {
        var _this = this;
        console.log('Fetching data for ' + this.address);
        fetch('internalapi/Account/Get?address=' + this.address + '&pageNumber=' + this.pageNumber)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.account = data;
        });
        fetch('internalapi/Account/GetTransactions?address=' + this.address + '&pageNumber=' + this.pageNumber)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.transactions = data;
        });
    };
    AccountComponent.prototype.formatCurrency = function (value) {
        var val = (value / 1).toFixed(2).replace(',', '.');
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    AccountComponent.prototype.subStr = function (input, length) {
        return input.substring(0, length) + '...';
    };
    return AccountComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
AccountComponent = __decorate([
    __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"]
], AccountComponent);
/* harmony default export */ __webpack_exports__["default"] = (AccountComponent);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var AppComponent = (function (_super) {
    __extends(AppComponent, _super);
    function AppComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AppComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"])({
        components: {
            MenuComponent: __webpack_require__(48),
            HeaderDataComponent: __webpack_require__(43)
        }
    })
], AppComponent);
/* harmony default export */ __webpack_exports__["default"] = (AppComponent);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var BlockComponent = (function (_super) {
    __extends(BlockComponent, _super);
    function BlockComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlockComponent.prototype.data = function () {
        return {
            block: null
        };
    };
    BlockComponent.prototype.mounted = function () {
        var _this = this;
        fetch('internalapi/Block/Get?blockNumber=' + this.$route.params.blockNumber)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.block = data;
        });
    };
    BlockComponent.prototype.subStr = function (input, length) {
        return input.substring(0, length) + '...';
    };
    return BlockComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
BlockComponent = __decorate([
    __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"]
], BlockComponent);
/* harmony default export */ __webpack_exports__["default"] = (BlockComponent);


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var HeaderDataComponent = (function (_super) {
    __extends(HeaderDataComponent, _super);
    function HeaderDataComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HeaderDataComponent.prototype.data = function () {
        return {
            headerData: null
        };
    };
    HeaderDataComponent.prototype.mounted = function () {
        this.loadData();
        setInterval(this.loadData, 60000);
    };
    HeaderDataComponent.prototype.loadData = function () {
        var _this = this;
        fetch('internalapi/HeaderData/Get')
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.headerData = data;
        });
    };
    HeaderDataComponent.prototype.formatCurrency = function (value) {
        var val = (value / 1).toFixed(2).replace(',', '.');
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    return HeaderDataComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
HeaderDataComponent = __decorate([
    __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"]
], HeaderDataComponent);
/* harmony default export */ __webpack_exports__["default"] = (HeaderDataComponent);


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var LatestBlocksComponent = (function (_super) {
    __extends(LatestBlocksComponent, _super);
    function LatestBlocksComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.blocks = [];
        return _this;
    }
    LatestBlocksComponent.prototype.mounted = function () {
        this.loadData();
    };
    LatestBlocksComponent.prototype.loadData = function () {
        var _this = this;
        fetch('internalapi/Block/GetLatestBlocks?limit=50' + this.$route.params.limit)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.blocks = data;
        });
    };
    return LatestBlocksComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
LatestBlocksComponent = __decorate([
    __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"]
], LatestBlocksComponent);
/* harmony default export */ __webpack_exports__["default"] = (LatestBlocksComponent);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var LatestBlocksComponent = (function (_super) {
    __extends(LatestBlocksComponent, _super);
    function LatestBlocksComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.transactions = [];
        return _this;
    }
    LatestBlocksComponent.prototype.mounted = function () {
        this.loadData();
        setInterval(this.loadData, 60000);
    };
    LatestBlocksComponent.prototype.loadData = function () {
        var _this = this;
        fetch('internalapi/Transaction/GetLatestTransactions?limit=50' + this.$route.params.limit)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.transactions = data;
        });
    };
    LatestBlocksComponent.prototype.subStr = function (input, length) {
        if (input == null)
            return "";
        return input.substring(0, length) + '...';
    };
    return LatestBlocksComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
LatestBlocksComponent = __decorate([
    __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"]
], LatestBlocksComponent);
/* harmony default export */ __webpack_exports__["default"] = (LatestBlocksComponent);


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var NavMenuComponent = (function (_super) {
    __extends(NavMenuComponent, _super);
    function NavMenuComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavMenuComponent.prototype.submit = function (event) {
        var _this = this;
        var searchTerm = event.srcElement.value;
        fetch('internalapi/Search/Get?searchTerm=' + searchTerm)
            .then(function (response) { return response.text(); })
            .then(function (data) {
            switch (data) {
                case 'block': {
                    _this.$router.push({ name: 'home' });
                    setTimeout(function () {
                        _this.$router.push({ name: 'block', params: { blockNumber: searchTerm } });
                    }, 50);
                    break;
                }
                case 'account': {
                    _this.$router.push({ name: 'home' });
                    setTimeout(function () {
                        _this.$router.push({ name: 'account', params: { address: searchTerm } });
                    }, 50);
                    break;
                }
                case 'transaction': {
                    _this.$router.push({ name: 'home' });
                    setTimeout(function () {
                        _this.$router.push({ name: 'transaction', params: { transactionHash: searchTerm } });
                    }, 50);
                    break;
                }
                case 'invalid': {
                    _this.$router.push({ name: 'home' });
                    break;
                }
            }
        });
    };
    return NavMenuComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
NavMenuComponent = __decorate([
    __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"]
], NavMenuComponent);
/* harmony default export */ __webpack_exports__["default"] = (NavMenuComponent);


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var PendingTransactionsComponent = (function (_super) {
    __extends(PendingTransactionsComponent, _super);
    function PendingTransactionsComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.transactions = [];
        return _this;
    }
    PendingTransactionsComponent.prototype.mounted = function () {
        this.loadData();
        setInterval(this.loadData, 60000);
    };
    PendingTransactionsComponent.prototype.loadData = function () {
        var _this = this;
        fetch('internalapi/Transaction/GetPendingTransactions?limit=50' + this.$route.params.limit)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.transactions = data;
        });
    };
    PendingTransactionsComponent.prototype.subStr = function (input, length) {
        if (input == null)
            return "";
        return input.substring(0, length) + '...';
    };
    return PendingTransactionsComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
PendingTransactionsComponent = __decorate([
    __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"]
], PendingTransactionsComponent);
/* harmony default export */ __webpack_exports__["default"] = (PendingTransactionsComponent);


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var TokensComponent = (function (_super) {
    __extends(TokensComponent, _super);
    function TokensComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tokens = [];
        return _this;
    }
    TokensComponent.prototype.mounted = function () {
        this.loadData();
    };
    TokensComponent.prototype.loadData = function () {
        var _this = this;
        fetch('internalapi/Token/GetAll')
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.tokens = data;
        });
    };
    TokensComponent.prototype.formatCurrency = function (value) {
        var val = (value / 1).toFixed(2).replace(',', '.');
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    return TokensComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
TokensComponent = __decorate([
    __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"]
], TokensComponent);
/* harmony default export */ __webpack_exports__["default"] = (TokensComponent);


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var TransactionComponent = (function (_super) {
    __extends(TransactionComponent, _super);
    function TransactionComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransactionComponent.prototype.data = function () {
        return {
            transaction: null
        };
    };
    TransactionComponent.prototype.mounted = function () {
        this.loadData();
        setInterval(this.loadData, 60000);
    };
    TransactionComponent.prototype.loadData = function () {
        var _this = this;
        fetch('internalapi/Transaction/Get?transactionHash=' + this.$route.params.transactionHash)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            _this.transaction = data;
        });
    };
    TransactionComponent.prototype.formatCurrency = function (value) {
        var val = (value / 1).toFixed(2).replace(',', '.');
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    return TransactionComponent;
}(__WEBPACK_IMPORTED_MODULE_0_vue__["default"]));
TransactionComponent = __decorate([
    __WEBPACK_IMPORTED_MODULE_1_vue_property_decorator__["Component"]
], TransactionComponent);
/* harmony default export */ __webpack_exports__["default"] = (TransactionComponent);


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(29),
  Html4Entities: __webpack_require__(28),
  Html5Entities: __webpack_require__(11),
  AllHtmlEntities: __webpack_require__(11)
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(31);
exports.encode = exports.stringify = __webpack_require__(32);


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    // feature test for Symbol support
    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var HashMap;
    (function (HashMap) {
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        HashMap.create = supportsCreate
            ? function () { return MakeDictionary(Object.create(null)); }
            : supportsProto
                ? function () { return MakeDictionary({ __proto__: null }); }
                : function () { return MakeDictionary({}); };
        HashMap.has = downLevel
            ? function (map, key) { return hasOwn.call(map, key); }
            : function (map, key) { return key in map; };
        HashMap.get = downLevel
            ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
            : function (map, key) { return map[key]; };
    })(HashMap || (HashMap = {}));
    // Load global or shim versions of Map, Set, and WeakMap
    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && __webpack_require__.i({"NODE_ENV":"development"}) && __webpack_require__.i({"NODE_ENV":"development"})["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    var Metadata = new _WeakMap();
    /**
      * Applies a set of decorators to a property of a target object.
      * @param decorators An array of decorators.
      * @param target The target object.
      * @param propertyKey (Optional) The property key to decorate.
      * @param attributes (Optional) The property descriptor for the target key.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *
      */
    function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsObject(target))
                throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                throw new TypeError();
            if (IsNull(attributes))
                attributes = undefined;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
        }
        else {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsConstructor(target))
                throw new TypeError();
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class Example {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *
      */
    function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    /**
      * Define a unique metadata entry on the target.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param metadataValue A value that contains attached metadata.
      * @param target The target object on which to define metadata.
      * @param propertyKey (Optional) The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *
      */
    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    Reflect.defineMetadata = defineMetadata;
    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasMetadata = hasMetadata;
    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getMetadata = getMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *
      */
    function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    /**
      * Gets the unique metadata keys defined on the target object.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *
      */
    function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    /**
      * Deletes the metadata entry from the target object with the provided key.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        if (!metadataMap.delete(metadataKey))
            return false;
        if (metadataMap.size > 0)
            return true;
        var targetMetadata = Metadata.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0)
            return true;
        Metadata.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated))
                    throw new TypeError();
                target = decorated;
            }
        }
        return target;
    }
    function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated))
                    throw new TypeError();
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function GetOrCreateMetadataMap(O, P, Create) {
        var targetMetadata = Metadata.get(O);
        if (IsUndefined(targetMetadata)) {
            if (!Create)
                return undefined;
            targetMetadata = new _Map();
            Metadata.set(O, targetMetadata);
        }
        var metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
            if (!Create)
                return undefined;
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
    }
    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
    }
    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        return ToBoolean(metadataMap.has(MetadataKey));
    }
    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        return undefined;
    }
    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return undefined;
        return metadataMap.get(MetadataKey);
    }
    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
            return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
            return ownKeys;
        if (ownKeys.length <= 0)
            return parentKeys;
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    function OrdinaryOwnMetadataKeys(O, P) {
        var keys = [];
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return keys;
        var keysObj = metadataMap.keys();
        var iterator = GetIterator(keysObj);
        var k = 0;
        while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
                keys.length = k;
                return keys;
            }
            var nextValue = IteratorValue(next);
            try {
                keys[k] = nextValue;
            }
            catch (e) {
                try {
                    IteratorClose(iterator);
                }
                finally {
                    throw e;
                }
            }
            k++;
        }
    }
    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    function Type(x) {
        if (x === null)
            return 1 /* Null */;
        switch (typeof x) {
            case "undefined": return 0 /* Undefined */;
            case "boolean": return 2 /* Boolean */;
            case "string": return 3 /* String */;
            case "symbol": return 4 /* Symbol */;
            case "number": return 5 /* Number */;
            case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
            default: return 6 /* Object */;
        }
    }
    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x) {
        return x === undefined;
    }
    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    function IsNull(x) {
        return x === null;
    }
    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
            case 0 /* Undefined */: return input;
            case 1 /* Null */: return input;
            case 2 /* Boolean */: return input;
            case 3 /* String */: return input;
            case 4 /* Symbol */: return input;
            case 5 /* Number */: return input;
        }
        var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result))
                throw new TypeError();
            return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }
    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result))
                    return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        throw new TypeError();
    }
    // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    function ToBoolean(argument) {
        return !!argument;
    }
    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    function ToString(argument) {
        return "" + argument;
    }
    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3 /* String */);
        if (IsSymbol(key))
            return key;
        return ToString(key);
    }
    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    function IsArray(argument) {
        return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === "[object Array]";
    }
    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    function IsCallable(argument) {
        // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
        return typeof argument === "function";
    }
    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    function IsConstructor(argument) {
        // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
        return typeof argument === "function";
    }
    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    function IsPropertyKey(argument) {
        switch (Type(argument)) {
            case 3 /* String */: return true;
            case 4 /* Symbol */: return true;
            default: return false;
        }
    }
    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    function GetMethod(V, P) {
        var func = V[P];
        if (func === undefined || func === null)
            return undefined;
        if (!IsCallable(func))
            throw new TypeError();
        return func;
    }
    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
    function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
            throw new TypeError(); // from Call
        var iterator = method.call(obj);
        if (!IsObject(iterator))
            throw new TypeError();
        return iterator;
    }
    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    function IteratorValue(iterResult) {
        return iterResult.value;
    }
    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
    }
    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
            f.call(iterator);
    }
    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
            return proto;
        // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.
        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype)
            return proto;
        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
            return proto;
        // If the constructor was not a function, then we cannot determine the heritage.
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
            return proto;
        // If we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O)
            return proto;
        // we have a pretty good guess at the heritage.
        return constructor;
    }
    // naive Map shim
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = (function () {
            function MapIterator(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            MapIterator.prototype["@@iterator"] = function () { return this; };
            MapIterator.prototype[iteratorSymbol] = function () { return this; };
            MapIterator.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    var result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: undefined, done: true };
            };
            MapIterator.prototype.throw = function (error) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            };
            MapIterator.prototype.return = function (value) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: value, done: true };
            };
            return MapIterator;
        }());
        return (function () {
            function Map() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            Object.defineProperty(Map.prototype, "size", {
                get: function () { return this._keys.length; },
                enumerable: true,
                configurable: true
            });
            Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
            Map.prototype.get = function (key) {
                var index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            };
            Map.prototype.set = function (key, value) {
                var index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            };
            Map.prototype.delete = function (key) {
                var index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    var size = this._keys.length;
                    for (var i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            };
            Map.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            };
            Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
            Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
            Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
            Map.prototype["@@iterator"] = function () { return this.entries(); };
            Map.prototype[iteratorSymbol] = function () { return this.entries(); };
            Map.prototype._find = function (key, insert) {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            };
            return Map;
        }());
        function getKey(key, _) {
            return key;
        }
        function getValue(_, value) {
            return value;
        }
        function getEntry(key, value) {
            return [key, value];
        }
    }
    // naive Set shim
    function CreateSetPolyfill() {
        return (function () {
            function Set() {
                this._map = new _Map();
            }
            Object.defineProperty(Set.prototype, "size", {
                get: function () { return this._map.size; },
                enumerable: true,
                configurable: true
            });
            Set.prototype.has = function (value) { return this._map.has(value); };
            Set.prototype.add = function (value) { return this._map.set(value, value), this; };
            Set.prototype.delete = function (value) { return this._map.delete(value); };
            Set.prototype.clear = function () { this._map.clear(); };
            Set.prototype.keys = function () { return this._map.keys(); };
            Set.prototype.values = function () { return this._map.values(); };
            Set.prototype.entries = function () { return this._map.entries(); };
            Set.prototype["@@iterator"] = function () { return this.keys(); };
            Set.prototype[iteratorSymbol] = function () { return this.keys(); };
            return Set;
        }());
    }
    // naive WeakMap shim
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return (function () {
            function WeakMap() {
                this._key = CreateUniqueKey();
            }
            WeakMap.prototype.has = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.has(table, this._key) : false;
            };
            WeakMap.prototype.get = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.get(table, this._key) : undefined;
            };
            WeakMap.prototype.set = function (target, value) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                table[this._key] = value;
                return this;
            };
            WeakMap.prototype.delete = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            };
            WeakMap.prototype.clear = function () {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            };
            return WeakMap;
        }());
        function CreateUniqueKey() {
            var key;
            do
                key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create)
                    return undefined;
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i)
                buffer[i] = Math.random() * 0xff | 0;
            return buffer;
        }
        function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
                if (typeof crypto !== "undefined")
                    return crypto.getRandomValues(new Uint8Array(size));
                if (typeof msCrypto !== "undefined")
                    return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8)
                    result += "-";
                if (byte < 16)
                    result += "0";
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }
    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary(obj) {
        obj.__ = undefined;
        delete obj.__;
        return obj;
    }
    // patch global Reflect
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    if (hasOwn.call(Reflect, p)) {
                        __global.Reflect[p] = Reflect[p];
                    }
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof global !== "undefined" ? global :
        typeof self !== "undefined" ? self :
            Function("return this;")());
})(Reflect || (Reflect = {}));
//# sourceMappingURL=Reflect.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(30), __webpack_require__(71)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(16)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(10)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(6, function() {
			var newContent = __webpack_require__(6);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(10)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(7, function() {
			var newContent = __webpack_require__(7);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(10)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(8, function() {
			var newContent = __webpack_require__(8);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  * vue-class-component v5.0.1
  * (c) 2015-2017 Evan You
  * @license MIT
  */


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(__webpack_require__(0));

function createDecorator(factory) {
    return function (_, key, index) {
        if (typeof index !== 'number') {
            index = undefined;
        }
        $decoratorQueue.push(function (options) { return factory(options, key, index); });
    };
}
function warn(message) {
    if (typeof console !== 'undefined') {
        console.warn('[vue-class-component] ' + message);
    }
}

function collectDataFromConstructor(vm, Component) {
    Component.prototype._init = function () {
        var _this = this;
        var keys = Object.getOwnPropertyNames(vm);
        if (vm.$options.props) {
            for (var key in vm.$options.props) {
                if (!vm.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        keys.forEach(function (key) {
            if (key.charAt(0) !== '_') {
                Object.defineProperty(_this, key, {
                    get: function () { return vm[key]; },
                    set: function (value) { return vm[key] = value; }
                });
            }
        });
    };
    var data = new Component();
    var plainData = {};
    Object.keys(data).forEach(function (key) {
        if (data[key] !== undefined) {
            plainData[key] = data[key];
        }
    });
    if (true) {
        if (!(Component.prototype instanceof Vue) && Object.keys(plainData).length > 0) {
            warn('Component class must inherit Vue or its descendant class ' +
                'when class property is used.');
        }
    }
    return plainData;
}

var $internalHooks = [
    'data',
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'render'
];
var $decoratorQueue = [];
function componentFactory(Component, options) {
    if (options === void 0) { options = {}; }
    options.name = options.name || Component._componentTag || Component.name;
    var proto = Component.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        if ($internalHooks.indexOf(key) > -1) {
            options[key] = proto[key];
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (typeof descriptor.value === 'function') {
            (options.methods || (options.methods = {}))[key] = descriptor.value;
        }
        else if (descriptor.get || descriptor.set) {
            (options.computed || (options.computed = {}))[key] = {
                get: descriptor.get,
                set: descriptor.set
            };
        }
    });
    (options.mixins || (options.mixins = [])).push({
        data: function () {
            return collectDataFromConstructor(this, Component);
        }
    });
    $decoratorQueue.forEach(function (fn) { return fn(options); });
    $decoratorQueue = [];
    var superProto = Object.getPrototypeOf(Component.prototype);
    var Super = superProto instanceof Vue
        ? superProto.constructor
        : Vue;
    return Super.extend(options);
}

function Component(options) {
    if (typeof options === 'function') {
        return componentFactory(options);
    }
    return function (Component) {
        return componentFactory(Component, options);
    };
}
(function (Component) {
    function registerHooks(keys) {
        $internalHooks.push.apply($internalHooks, keys);
    }
    Component.registerHooks = registerHooks;
})(Component || (Component = {}));
var Component$1 = Component;

exports['default'] = Component$1;
exports.createDecorator = createDecorator;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(17),
  /* template */
  __webpack_require__(57),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Erik\\source\\repos\\caladan\\Caladan.Frontend\\ClientApp\\components\\account\\account.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] account.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-431dfa42", Component.options)
  } else {
    hotAPI.reload("data-v-431dfa42", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(18),
  /* template */
  __webpack_require__(53),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Erik\\source\\repos\\caladan\\Caladan.Frontend\\ClientApp\\components\\app\\app.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] app.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1a321bf7", Component.options)
  } else {
    hotAPI.reload("data-v-1a321bf7", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(19),
  /* template */
  __webpack_require__(60),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Erik\\source\\repos\\caladan\\Caladan.Frontend\\ClientApp\\components\\block\\block.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] block.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5e3849c2", Component.options)
  } else {
    hotAPI.reload("data-v-5e3849c2", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(20),
  /* template */
  __webpack_require__(58),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Erik\\source\\repos\\caladan\\Caladan.Frontend\\ClientApp\\components\\headerdata\\headerdata.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] headerdata.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5321bfdb", Component.options)
  } else {
    hotAPI.reload("data-v-5321bfdb", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  null,
  /* template */
  __webpack_require__(54),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Erik\\source\\repos\\caladan\\Caladan.Frontend\\ClientApp\\components\\home\\home.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] home.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1db42b4a", Component.options)
  } else {
    hotAPI.reload("data-v-1db42b4a", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(21),
  /* template */
  __webpack_require__(63),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Erik\\source\\repos\\caladan\\Caladan.Frontend\\ClientApp\\components\\latestblocks\\latestblocks.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] latestblocks.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-fa5f64ca", Component.options)
  } else {
    hotAPI.reload("data-v-fa5f64ca", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(22),
  /* template */
  __webpack_require__(59),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Erik\\source\\repos\\caladan\\Caladan.Frontend\\ClientApp\\components\\latesttransactions\\latesttransactions.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] latesttransactions.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-54f055fb", Component.options)
  } else {
    hotAPI.reload("data-v-54f055fb", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  null,
  /* template */
  __webpack_require__(55),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Erik\\source\\repos\\caladan\\Caladan.Frontend\\ClientApp\\components\\miningpools\\miningpools.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] miningpools.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-266933ab", Component.options)
  } else {
    hotAPI.reload("data-v-266933ab", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(64)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(23),
  /* template */
  __webpack_require__(61),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Erik\\source\\repos\\caladan\\Caladan.Frontend\\ClientApp\\components\\navmenu\\navmenu.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] navmenu.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-63a1f175", Component.options)
  } else {
    hotAPI.reload("data-v-63a1f175", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(24),
  /* template */
  __webpack_require__(56),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Erik\\source\\repos\\caladan\\Caladan.Frontend\\ClientApp\\components\\pendingtransactions\\pendingtransactions.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] pendingtransactions.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3ba6aba1", Component.options)
  } else {
    hotAPI.reload("data-v-3ba6aba1", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(25),
  /* template */
  __webpack_require__(62),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Erik\\source\\repos\\caladan\\Caladan.Frontend\\ClientApp\\components\\tokens\\tokens.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] tokens.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6510f63b", Component.options)
  } else {
    hotAPI.reload("data-v-6510f63b", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(26),
  /* template */
  __webpack_require__(52),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Erik\\source\\repos\\caladan\\Caladan.Frontend\\ClientApp\\components\\transaction\\transaction.vue.html"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] transaction.vue.html: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(1)
  hotAPI.install(__webpack_require__(0), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0123773d", Component.options)
  } else {
    hotAPI.reload("data-v-0123773d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('section', {
    staticClass: "breadcramb-content breadcramb-v2 pt25 pb25 parallax-bg color-overlay",
    staticStyle: {
      "background-image": "url(img/footer-bg.jpg)"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-9"
  }, [(_vm.transaction == null) ? _c('h3', [_vm._v("LOADING...")]) : (_vm.transaction.blockNumber == 0) ? _c('h3', [_vm._v("PENDING TRANSACTION")]) : _c('h3', [_vm._v("CONFIRMED TRANSACTION")])]), _vm._v(" "), _vm._m(0)])])]), _vm._v(" "), (_vm.transaction == null) ? _c('div', {
    staticClass: "loading-content"
  }, [_vm._m(1)]) : (_vm.transaction.found == true) ? _c('div', [_c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12"
  }, [_c('div', {
    staticClass: "section-title text-center mb30"
  }, [_c('h4', [_vm._v(_vm._s(_vm.transaction.transactionHash))]), _vm._v(" "), (_vm.transaction.blockNumber == 0) ? _c('p', [_vm._v("The transaction is still pending in the network.")]) : _vm._e(), _vm._v(" "), (_vm.transaction.blockNumber == 0) ? _c('p', [_vm._v("This page will update itself once the transaction gets confirmed.")]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "section-divider divider-traingle"
  })])])])])]), _vm._v(" "), _c('section', {
    staticClass: "section-padding gray-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-md-8 col-sm-9"
  }, [_c('div', {
    staticClass: "featured-box white-bg"
  }, [_c('h4', [_vm._v("Transaction details")]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Hash:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.transaction.transactionHash))]), _vm._v(" "), (_vm.transaction.blockNumber > 0) ? _c('dt', [_vm._v("Confirmed (UTC):")]) : _vm._e(), _vm._v(" "), (_vm.transaction.blockNumber > 0) ? _c('dd', [_vm._v(_vm._s(_vm.transaction.confirmedOnFormatted))]) : _vm._e(), _vm._v(" "), (_vm.transaction.blockNumber > 0) ? _c('dt', [_vm._v("Confirmations:")]) : _vm._e(), _vm._v(" "), (_vm.transaction.blockNumber > 0) ? _c('dd', [_vm._v(_vm._s(_vm.transaction.confirmations) + " (mined in block "), _c('router-link', {
    attrs: {
      "to": {
        name: 'block',
        params: {
          blockNumber: _vm.transaction.blockNumber
        }
      }
    }
  }, [_vm._v(_vm._s(_vm.transaction.blockNumber))]), _vm._v(")")], 1) : _vm._e(), _vm._v(" "), (_vm.transaction.blockNumber == 0) ? _c('dt', [_vm._v("Status:")]) : _vm._e(), _vm._v(" "), (_vm.transaction.blockNumber == 0) ? _c('dd', [_c('div', {
    staticClass: "col-md-2 blockPending"
  }, [_c('img', {
    attrs: {
      "src": "/img/loader.gif"
    }
  })]), _c('div', {
    staticClass: "col-md-6"
  }, [_vm._v(" Pending...")])]) : _vm._e()]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("From:")]), _vm._v(" "), _c('dd', [_c('router-link', {
    attrs: {
      "to": {
        name: 'account',
        params: {
          address: _vm.transaction.from
        }
      }
    }
  }, [_vm._v(_vm._s(_vm.transaction.from))])], 1), _vm._v(" "), _c('dt', [_vm._v("To:")]), _vm._v(" "), _c('dd', [_c('router-link', {
    attrs: {
      "to": {
        name: 'account',
        params: {
          address: _vm.transaction.to
        }
      }
    }
  }, [_vm._v(_vm._s(_vm.transaction.to))])], 1)]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Value:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.transaction.value) + " " + _vm._s(_vm.transaction.symbol))]), _vm._v(" "), (_vm.transaction.priceBtc > 0) ? _c('dt', [_vm._v("Value (BTC):")]) : _vm._e(), _vm._v(" "), (_vm.transaction.priceBtc > 0) ? _c('dd', [_vm._v(_vm._s(_vm.transaction.priceBtc * _vm.transaction.value))]) : _vm._e(), _vm._v(" "), (_vm.transaction.priceUsd > 0) ? _c('dt', [_vm._v("Value (USD):")]) : _vm._e(), _vm._v(" "), (_vm.transaction.priceUsd > 0) ? _c('dd', [_vm._v(_vm._s(_vm.formatCurrency(_vm.transaction.priceUsd * _vm.transaction.value)))]) : _vm._e(), _vm._v(" "), (_vm.transaction.priceEur > 0) ? _c('dt', [_vm._v("Value (EUR):")]) : _vm._e(), _vm._v(" "), (_vm.transaction.priceEur > 0) ? _c('dd', [_vm._v(_vm._s(_vm.formatCurrency(_vm.transaction.priceEur * _vm.transaction.value)))]) : _vm._e()])])]), _vm._v(" "), _c('div', {
    staticClass: "col-md-4 col-sm-3"
  }, [_c('div', {
    staticClass: "featured-box white-bg"
  }, [_c('h4', [_vm._v("Gas")]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Gas limit:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.transaction.gas))]), _vm._v(" "), _c('dt', [_vm._v("Gas used:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.transaction.gasUsed))]), _vm._v(" "), _c('dt', [_vm._v("Gas price:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.transaction.gasPrice) + " gwei")]), _vm._v(" "), _c('dt', [_vm._v("Transaction fee:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.transaction.fee) + " UBQ")])])])])])])]), _vm._v(" "), _c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-md-12"
  }, [_c('div', {
    staticClass: "contact-info-box"
  }, [_c('div', {
    staticClass: "col-sm-12"
  }, [_c('h4', [_vm._v("Technical details")]), _vm._v(" "), _c('div', {
    staticClass: "tabsContainer"
  }, [_c('ul', {
    staticClass: "nav nav-tabs nav-justified"
  }, [_c('li', {
    staticClass: "nav-item active"
  }, [_c('a', {
    staticClass: "nav-link",
    attrs: {
      "data-toggle": "tab",
      "href": "#panel1",
      "role": "tab"
    }
  }, [_vm._v("Details")])]), _vm._v(" "), _c('li', {
    staticClass: "nav-item"
  }, [_c('a', {
    staticClass: "nav-link",
    attrs: {
      "data-toggle": "tab",
      "href": "#panel2",
      "role": "tab"
    }
  }, [_vm._v("Receipt")])]), _vm._v(" "), _c('li', {
    staticClass: "nav-item"
  }, [_c('a', {
    staticClass: "nav-link",
    attrs: {
      "data-toggle": "tab",
      "href": "#panel3",
      "role": "tab"
    }
  }, [_vm._v("Raw data")])])]), _vm._v(" "), _c('div', {
    staticClass: "tab-content card"
  }, [_c('div', {
    staticClass: "tab-pane fade active in",
    attrs: {
      "id": "panel1",
      "role": "tabpanel"
    }
  }, [_c('dl', [_c('dt', [_vm._v("Transaction hash:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.transaction.transactionHash))]), _vm._v(" "), _c('dt', [_vm._v("Included in Block:")]), _vm._v(" "), _c('dd', [_c('router-link', {
    attrs: {
      "to": {
        name: 'block',
        params: {
          blockNumber: _vm.transaction.blockNumber
        }
      }
    }
  }, [_vm._v(_vm._s(_vm.transaction.blockNumber))])], 1), _vm._v(" "), _c('dt', [_vm._v("Transaction index:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.transaction.transactionIndex))]), _vm._v(" "), _c('dt', [_vm._v("Block hash:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.transaction.blockHash))]), _vm._v(" "), _c('dt', [_vm._v("Nonce:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.transaction.nonce))]), _vm._v(" "), _c('dt', [_vm._v("Timestamp:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.transaction.timestamp))]), _vm._v(" "), _c('dt', [_vm._v("Confirmed (UTC):")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.transaction.confirmedOnFormatted))])]), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Input:")]), _vm._v(" "), _c('dd', [_c('pre', [_c('code', [_vm._v(_vm._s(_vm.transaction.input))])])])])]), _vm._v(" "), _c('div', {
    staticClass: "tab-pane fade",
    attrs: {
      "id": "panel2",
      "role": "tabpanel"
    }
  }, [_c('h4', [_vm._v("Transaction receipt")]), _vm._v(" "), _c('pre', [_c('code', [_vm._v(_vm._s(_vm.transaction.receiptRaw))])])]), _vm._v(" "), _c('div', {
    staticClass: "tab-pane fade",
    attrs: {
      "id": "panel3",
      "role": "tabpanel"
    }
  }, [_c('h4', [_vm._v("Raw transaction data")]), _vm._v(" "), _c('pre', [_c('code', [_vm._v(_vm._s(_vm.transaction.raw))])])])])])])])])])])])]) : _c('div', [_c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12"
  }, [_c('div', {
    staticClass: "section-title text-center mb30"
  }, [_c('h4', [_vm._v("Transaction not found")]), _vm._v(" "), _c('div', {
    staticClass: "section-divider divider-traingle"
  })])])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col-sm-3"
  }, [_c('ul', [_c('li', [_c('a', {
    attrs: {
      "href": "/"
    }
  }, [_vm._v("Home")])]), _vm._v(" "), _c('li', [_vm._v("Transaction")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12 text-center"
  }, [_c('h3', [_vm._v("Loading...")])])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(1).rerender("data-v-0123773d", module.exports)
  }
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "app"
    }
  }, [_c('nav', {
    staticClass: "navbar navbar-default navbar-sticky bootsnav"
  }, [_c('div', {
    staticClass: "header-top primary-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-8"
  }, [_c('headerData-component')], 1), _vm._v(" "), _vm._m(0)])])]), _vm._v(" "), _c('menu-component'), _vm._v(" "), _c('router-view')], 1)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col-sm-4"
  }, [_c('ul', {
    staticClass: "social-link pull-right"
  }, [_c('li', [_vm._v("Follow us")]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "target": "_blank",
      "href": "https://www.ubiqsmart.com/"
    }
  }, [_c('i', {
    staticClass: "fa fa-link"
  })])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "target": "_blank",
      "href": "https://twitter.com/ubiqsmart"
    }
  }, [_c('i', {
    staticClass: "fa fa-twitter"
  })])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "target": "_blank",
      "href": "https://blog.ubiqsmart.com/"
    }
  }, [_c('i', {
    staticClass: "fa fa-medium"
  })])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(1).rerender("data-v-1a321bf7", module.exports)
  }
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "container"
  }, [_c('br'), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "title-section"
  }, [_c('h1', [_vm._v("Ubiq - Smart contracts for an automated world")]), _vm._v(" "), _c('p', [_vm._v("Ubiq is a decentralized platform which allows the creation and implementation of smart contracts and decentralized applications. Built upon an improved Ethereum codebase, the Ubiq blockchain acts as a large globally distributed ledger and supercomputer, allowing developers to create decentralized and automated solutions to thousands of tasks which today are carried out by third party intermediaries. ")])])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('br'), _vm._v(" "), _c('div', {
    staticClass: "about-box hidden-xs"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-md-3 col-sm-3"
  }, [_c('div', {
    staticClass: "about-post"
  }, [_c('a', {
    staticClass: "active",
    attrs: {
      "href": "#",
      "data-link": "1"
    }
  }, [_c('i', {
    staticClass: "fa fa-desktop",
    staticStyle: {
      "font-size": "48px"
    }
  })]), _vm._v(" "), _c('h4', [_vm._v("DESKTOP")]), _vm._v(" "), _c('p', [_vm._v("Full desktop wallet for UBQ and Ubiq based tokens. ")])])]), _vm._v(" "), _c('div', {
    staticClass: "col-md-3 col-sm-3"
  }, [_c('div', {
    staticClass: "about-post"
  }, [_c('a', {
    attrs: {
      "href": "#",
      "data-link": "2"
    }
  }, [_c('i', {
    staticClass: "fa fa-globe",
    staticStyle: {
      "font-size": "48px"
    }
  })]), _vm._v(" "), _c('h4', [_vm._v("BROWSER")]), _vm._v(" "), _c('p', [_vm._v("Browser based, client-side wallet for UBQ and Ubiq based tokens. ")])])]), _vm._v(" "), _c('div', {
    staticClass: "col-md-3 col-sm-3"
  }, [_c('div', {
    staticClass: "about-post"
  }, [_c('a', {
    attrs: {
      "href": "#",
      "data-link": "3"
    }
  }, [_c('i', {
    staticClass: "fa fa-gears",
    staticStyle: {
      "font-size": "48px"
    }
  })]), _vm._v(" "), _c('h4', [_vm._v("HARDWARE")]), _vm._v(" "), _c('p', [_vm._v("Secure your funds offline with a dedicated hardware wallet.  ")])])]), _vm._v(" "), _c('div', {
    staticClass: "col-md-3 col-sm-3"
  }, [_c('div', {
    staticClass: "about-post"
  }, [_c('a', {
    attrs: {
      "href": "#",
      "data-link": "4"
    }
  }, [_c('i', {
    staticClass: "fa fa-code",
    staticStyle: {
      "font-size": "48px"
    }
  })]), _vm._v(" "), _c('h4', [_vm._v("SERVER/CONSOLE")]), _vm._v(" "), _c('p', [_vm._v("Go-ubiq (Gubiq) is the official golang implementation of the Ubiq protocol. ")])])])])]), _vm._v(" "), _c('br'), _vm._v(" "), _c('br'), _vm._v(" "), _c('br'), _vm._v(" "), _c('br')])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(1).rerender("data-v-1db42b4a", module.exports)
  }
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('section', {
    staticClass: "breadcramb-content breadcramb-v2 pt25 pb25 parallax-bg color-overlay",
    staticStyle: {
      "background-image": "url(img/footer-bg.jpg)"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-6"
  }, [_c('h3', [_vm._v("MINING POOLS")])]), _vm._v(" "), _c('div', {
    staticClass: "col-sm-6"
  }, [_c('ul', [_c('li', [_c('a', {
    attrs: {
      "href": "/"
    }
  }, [_vm._v("Home")])]), _vm._v(" "), _c('li', [_vm._v("Mining Pools")])])])])])]), _vm._v(" "), _c('section', {
    staticClass: "section-padding gray-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12"
  }, [_c('div', {
    staticClass: "section-title text-center mb30"
  }, [_c('h2', [_vm._v("Mining Pools")]), _vm._v(" "), _c('p', [_vm._v("This page displays a list of known mining pools.")]), _vm._v(" "), _c('div', {
    staticClass: "section-divider divider-traingle"
  })])])])])]), _vm._v(" "), _c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-lg-12"
  }, [_c('div', {
    staticClass: "card card-borderless"
  }, [_c('div', {
    staticClass: "tab-content"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-12 col-lg-12"
  }, [_c('table', {
    staticClass: "table table-striped"
  }, [_c('thead', {
    staticClass: "thead-dark"
  }, [_c('tr', [_c('th', [_vm._v("Pool")])])]), _vm._v(" "), _c('tbody', [_c('tr', [_c('td', [_c('a', {
    attrs: {
      "href": "http://ubiq.hodlpool.com/",
      "target": "_blank"
    }
  }, [_vm._v("HODLPool")])])]), _vm._v(" "), _c('tr', [_c('td', [_c('a', {
    attrs: {
      "href": "https://ubiqpool.maxhash.org/",
      "target": "_blank"
    }
  }, [_vm._v("MaxHash.org")])])]), _vm._v(" "), _c('tr', [_c('td', [_c('a', {
    attrs: {
      "href": "http://ubiq.minerpool.net/",
      "target": "_blank"
    }
  }, [_vm._v("Minerpool.net")])])]), _vm._v(" "), _c('tr', [_c('td', [_c('a', {
    attrs: {
      "href": "https://ubqkings.com",
      "target": "_blank"
    }
  }, [_vm._v("UBQKings.com")])])]), _vm._v(" "), _c('tr', [_c('td', [_c('a', {
    attrs: {
      "href": "https://ucrypto.net/currency/?curr=UBQ",
      "target": "_blank"
    }
  }, [_vm._v("uCrypto.net")])])])])])])])])])])])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(1).rerender("data-v-266933ab", module.exports)
  }
}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('section', {
    staticClass: "section-padding white-bg"
  }, [(_vm.transactions.length) ? _c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-lg-12"
  }, [_c('div', {
    staticClass: "card card-borderless"
  }, [_c('div', {
    staticClass: "tab-content"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-12 col-lg-12"
  }, [_c('table', {
    staticClass: "table"
  }, [_vm._m(2), _vm._v(" "), _c('tbody', _vm._l((_vm.transactions), function(item) {
    return _c('tr', [_c('td', [(item.originalTransactionHash == null) ? _c('span', [_c('router-link', {
      attrs: {
        "to": {
          name: 'transaction',
          params: {
            transactionHash: item.transactionHash
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.transactionHash, 20)))])], 1) : _c('span', [_c('router-link', {
      attrs: {
        "to": {
          name: 'transaction',
          params: {
            transactionHash: item.originalTransactionHash
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.originalTransactionHash, 20)))])], 1)]), _vm._v(" "), _c('td', {
      staticClass: "visible-lg"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'account',
          params: {
            address: item.from
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.from, 20)))])], 1), _vm._v(" "), _c('td', {
      staticClass: "visible-lg"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'account',
          params: {
            address: item.to
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.to, 20)))])], 1), _vm._v(" "), _c('td', [_vm._v(_vm._s(item.value) + " " + _vm._s(item.symbol))]), _vm._v(" "), _c('td', {
      staticClass: "visible-md"
    }, [_vm._v(_vm._s(item.confirmedOnFormatted))])])
  }))])])])])])])])]) : _c('div', {
    staticClass: "loading-content"
  }, [_c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12 text-center"
  }, [_c('h3', [_vm._v("Loading...")])])])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "breadcramb-content breadcramb-v2 pt25 pb25 parallax-bg color-overlay",
    staticStyle: {
      "background-image": "url(img/footer-bg.jpg)"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-6"
  }, [_c('h3', [_vm._v("PENDING TRANSACTIONS")])]), _vm._v(" "), _c('div', {
    staticClass: "col-sm-6"
  }, [_c('ul', [_c('li', [_c('a', {
    attrs: {
      "href": "/"
    }
  }, [_vm._v("Home")])]), _vm._v(" "), _c('li', [_vm._v("Pending Transactions")])])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section-padding gray-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12"
  }, [_c('div', {
    staticClass: "section-title text-center mb30"
  }, [_c('h2', [_vm._v("Pending transactions")]), _vm._v(" "), _c('p', [_vm._v("This page displays all pending transactions on the Ubiq network.")]), _vm._v(" "), _c('div', {
    staticClass: "section-divider divider-traingle"
  })])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('thead', {
    staticClass: "thead-dark"
  }, [_c('tr', [_c('th', [_vm._v("Details")]), _vm._v(" "), _c('th', {
    staticClass: "visible-lg"
  }, [_vm._v("From")]), _vm._v(" "), _c('th', {
    staticClass: "visible-lg"
  }, [_vm._v("To")]), _vm._v(" "), _c('th', [_vm._v("Value")]), _vm._v(" "), _c('th', {
    staticClass: "visible-md"
  }, [_vm._v("Date (UTC)")])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(1).rerender("data-v-3ba6aba1", module.exports)
  }
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._m(0), _vm._v(" "), (_vm.account != null) ? _c('div', [_c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12"
  }, [_c('div', {
    staticClass: "section-title text-center mb30"
  }, [_c('h4', [_vm._v(_vm._s(_vm.account.address))]), _vm._v(" "), _c('div', {
    staticClass: "section-divider divider-traingle"
  })])])])])]), _vm._v(" "), _c('section', {
    staticClass: "section-padding gray-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-md-8 col-sm-8"
  }, [_c('div', {
    staticClass: "featured-box white-bg"
  }, [_c('h4', [_vm._v("Account details")]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Address:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.account.address))]), _vm._v(" "), _c('dt', [_vm._v("Transactions:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.account.numberOfTransactions))])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Balance:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.account.balance) + " UBQ")])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Balance (BTC):")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.account.balanceBtc))]), _vm._v(" "), _c('dt', [_vm._v("Balance (USD):")]), _vm._v(" "), _c('dd', [_vm._v("$" + _vm._s(_vm.formatCurrency(_vm.account.balanceUsd)))]), _vm._v(" "), _c('dt', [_vm._v("Balance (EUR):")]), _vm._v(" "), _c('dd', [_vm._v("€" + _vm._s(_vm.formatCurrency(_vm.account.balanceEur)))])]), _vm._v(" "), _c('hr'), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('a', {
    staticClass: "waves-effect waves-light btn-large export-btn",
    attrs: {
      "href": /exporttransactions/ + _vm.account.address
    }
  }, [_vm._v("CSV Export")]), _vm._v(" "), _c('a', {
    staticClass: "waves-effect waves-light btn-large export-btn",
    attrs: {
      "href": /exporttransactionswithtokens/ + _vm.account.address
    }
  }, [_vm._v("CSV Export (with tokens)")])])]), _vm._v(" "), _c('div', {
    staticClass: "col-md-4 col-sm-4"
  }, [_c('div', {
    staticClass: "featured-box white-bg"
  }, [_c('h4', [_vm._v("Token balance")]), _vm._v(" "), _c('hr'), _vm._v(" "), (_vm.account.tokens.length) ? _c('div', _vm._l((_vm.account.tokens), function(item) {
    return _c('div', {
      staticClass: "row"
    }, [_c('div', {
      staticClass: "col-sm-4 tokenBalance"
    }, [(item.logo != null) ? _c('span', [_c('img', {
      attrs: {
        "src": item.logo,
        "title": item.name
      }
    })]) : _c('span', [_vm._v(_vm._s(item.name))])]), _vm._v(" "), (item.logo != null) ? _c('div', {
      staticClass: "col-sm-8 tokenBalance",
      staticStyle: {
        "padding-top": "3px"
      }
    }, [_vm._v("\n                                        " + _vm._s(item.balance) + " " + _vm._s(item.symbol) + "\n                                    ")]) : _c('div', {
      staticClass: "col-sm-8 tokenBalance"
    }, [_vm._v("\n                                        " + _vm._s(item.balance) + " " + _vm._s(item.symbol) + "\n                                    ")])])
  })) : _c('div', [_c('p', [_vm._v("No token balance found")])])]), _vm._v(" "), _c('div', {
    staticClass: "featured-box white-bg"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-12"
  }, [_c('img', {
    staticClass: "identicon",
    attrs: {
      "src": _vm.account.identicon,
      "title": _vm.account.address
    }
  })])])])])])])]), _vm._v(" "), _c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-12 col-lg-12"
  }, [_c('div', {
    staticClass: "cart-price"
  }, [_vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "col-md-8 col-sm-8"
  }, [_c('button', {
    staticClass: "paging-btn pull-right float-sm-none",
    on: {
      "click": _vm.nextPage
    }
  }, [_vm._v("Next »")]), _vm._v(" "), _c('button', {
    staticClass: "paging-btn pull-right float-sm-none",
    on: {
      "click": _vm.previousPage
    }
  }, [_vm._v("« Previous")])]), _vm._v(" "), (_vm.transactions.length) ? _c('table', {
    staticClass: "table table-striped"
  }, [_vm._m(3), _vm._v(" "), _c('tbody', _vm._l((_vm.transactions), function(item) {
    return _c('tr', {}, [_c('td', [(item.from == _vm.account.address) ? _c('span', {
      staticClass: "tx-out"
    }, [_vm._v("Out")]) : _c('span', {
      staticClass: "tx-in"
    }, [_vm._v("In")])]), _vm._v(" "), _c('td', [(item.originalTransactionHash == null) ? _c('span', [_c('router-link', {
      staticClass: "gridlink",
      attrs: {
        "to": {
          name: 'transaction',
          params: {
            transactionHash: item.transactionHash
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.transactionHash, 20)))])], 1) : _c('span', [_c('router-link', {
      staticClass: "gridlink",
      attrs: {
        "to": {
          name: 'transaction',
          params: {
            transactionHash: item.originalTransactionHash
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.originalTransactionHash, 20)))])], 1)]), _vm._v(" "), _c('td', {
      staticClass: "visible-lg"
    }, [(item.from == _vm.account.address) ? _c('span', [_c('a', {
      staticClass: "gridlink",
      attrs: {
        "onclick": "return false",
        "href": /account/ + item.to
      },
      on: {
        "click": function($event) {
          _vm.navigate(item.to)
        }
      }
    }, [_vm._v(_vm._s(item.to))])]) : _c('span', [_c('a', {
      staticClass: "gridlink",
      attrs: {
        "onclick": "return false",
        "href": /account/ + item.from
      },
      on: {
        "click": function($event) {
          _vm.navigate(item.from)
        }
      }
    }, [_vm._v(_vm._s(item.from))])])]), _vm._v(" "), _c('td', {
      staticClass: "visible-md visible-lg"
    }, [_vm._v(_vm._s(item.confirmedOnFormatted))]), _vm._v(" "), _c('td', {
      staticClass: "text-right"
    }, [(item.from == _vm.account.address) ? _c('span', [_c('span', {
      staticStyle: {
        "color": "#f4516c"
      }
    }, [_c('strong', [_vm._v("-" + _vm._s(item.value))])]), _vm._v(" " + _vm._s(item.symbol))]) : _c('span', [_c('span', {
      staticStyle: {
        "color": "#0CA579"
      }
    }, [_c('strong', [_vm._v(_vm._s(item.value))])]), _vm._v(" " + _vm._s(item.symbol))])])])
  }))]) : _vm._e()])])])])]), _vm._v(" "), (_vm.account.blocks.length) ? _c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-12 col-lg-12"
  }, [_c('div', {
    staticClass: "cart-price"
  }, [_vm._m(4), _vm._v(" "), (_vm.account.blocks.length) ? _c('table', {
    staticClass: "table table-striped"
  }, [_vm._m(5), _vm._v(" "), _c('tbody', _vm._l((_vm.account.blocks), function(item) {
    return _c('tr', [_c('td', [_c('router-link', {
      attrs: {
        "to": {
          name: 'block',
          params: {
            blockNumber: item.blockNumber
          }
        }
      }
    }, [_vm._v(_vm._s(item.blockNumber))])], 1), _vm._v(" "), _c('td', {
      staticClass: "visible-lg"
    }, [_vm._v(_vm._s(item.hash))]), _vm._v(" "), _c('td', {
      staticClass: "visible-lg"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'account',
          params: {
            address: item.miner
          }
        }
      }
    }, [_vm._v(_vm._s(item.miner))])], 1), _vm._v(" "), _c('td', {
      staticClass: "text-right"
    }, [_vm._v(_vm._s(item.numberOfTransactions))])])
  }))]) : _vm._e()])])])])]) : _vm._e()]) : _c('div', {
    staticClass: "loading-content"
  }, [_c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12 text-center"
  }, [_c('h3', [_vm._v("Loading...")])])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "breadcramb-content breadcramb-v2 pt25 pb25 parallax-bg color-overlay",
    staticStyle: {
      "background-image": "url(img/footer-bg.jpg)"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-6"
  }, [_c('h3', [_vm._v("ACCOUNT")])]), _vm._v(" "), _c('div', {
    staticClass: "col-sm-6"
  }, [_c('ul', [_c('li', [_c('a', {
    attrs: {
      "href": "/"
    }
  }, [_vm._v("Home")])]), _vm._v(" "), _c('li', [_vm._v("Account")])])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_c('strong', [_vm._v("Export transactions")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col-md-4 col-sm-4"
  }, [_c('h3', [_vm._v("Transactions")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('thead', {
    staticClass: "thead-dark"
  }, [_c('tr', [_c('th'), _vm._v(" "), _c('th', [_vm._v("Details")]), _vm._v(" "), _c('th', {
    staticClass: "visible-lg"
  }, [_vm._v("Sender / Receiver")]), _vm._v(" "), _c('th', {
    staticClass: "visible-md visible-lg"
  }, [_vm._v("Date (UTC)")]), _vm._v(" "), _c('th', {
    staticClass: "text-right"
  }, [_vm._v("Value")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col-md-4 col-sm-4"
  }, [_c('h3', [_vm._v("Last 200 mined blocks")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('thead', {
    staticClass: "thead-dark"
  }, [_c('tr', [_c('th', [_vm._v("Number")]), _vm._v(" "), _c('th', {
    staticClass: "visible-lg"
  }, [_vm._v("Hash")]), _vm._v(" "), _c('th', {
    staticClass: "visible-lg"
  }, [_vm._v("Miner")]), _vm._v(" "), _c('th', {
    staticClass: "text-right"
  }, [_vm._v("Transactions")])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(1).rerender("data-v-431dfa42", module.exports)
  }
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "top-cta"
  }, [_c('ul', [_c('li', [_c('i', [_vm._v("Latest block:")]), (_vm.headerData != null) ? _c('span', [_vm._v(_vm._s(_vm.headerData.latestBlockNumber))]) : _c('span', [_vm._v("...")])]), _vm._v(" "), _c('li', [_c('i', [_vm._v("Avg. block time:")]), (_vm.headerData != null) ? _c('span', [_vm._v(_vm._s(_vm.headerData.averageBlockTime) + "s")]) : _c('span', [_vm._v("...")])]), _vm._v(" "), _c('li', [_c('i', [_vm._v("Price:")]), (_vm.headerData != null) ? _c('span', [_vm._v("$" + _vm._s(_vm.formatCurrency(_vm.headerData.price)))]) : _c('span', [_vm._v("...")])]), _vm._v(" "), _c('li', [_c('i', [_vm._v("Market cap:")]), (_vm.headerData != null) ? _c('span', [_vm._v("$" + _vm._s(_vm.formatCurrency(_vm.headerData.marketCap)))]) : _c('span', [_vm._v("...")])])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(1).rerender("data-v-5321bfdb", module.exports)
  }
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('section', {
    staticClass: "section-padding white-bg"
  }, [(_vm.transactions.length) ? _c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-lg-12"
  }, [_c('div', {
    staticClass: "card card-borderless"
  }, [_c('div', {
    staticClass: "tab-content"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-12 col-lg-12"
  }, [_c('table', {
    staticClass: "table"
  }, [_vm._m(2), _vm._v(" "), _c('tbody', _vm._l((_vm.transactions), function(item) {
    return _c('tr', [_c('td', [(item.originalTransactionHash == null) ? _c('span', [_c('router-link', {
      attrs: {
        "to": {
          name: 'transaction',
          params: {
            transactionHash: item.transactionHash
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.transactionHash, 20)))])], 1) : _c('span', [_c('router-link', {
      attrs: {
        "to": {
          name: 'transaction',
          params: {
            transactionHash: item.originalTransactionHash
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.originalTransactionHash, 20)))])], 1)]), _vm._v(" "), _c('td', {
      staticClass: "visible-lg"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'account',
          params: {
            address: item.from
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.from, 20)))])], 1), _vm._v(" "), _c('td', {
      staticClass: "visible-lg"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'account',
          params: {
            address: item.to
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.to, 20)))])], 1), _vm._v(" "), _c('td', [_vm._v(_vm._s(item.value) + " " + _vm._s(item.symbol))]), _vm._v(" "), _c('td', {
      staticClass: "visible-md"
    }, [_vm._v(_vm._s(item.confirmedOnFormatted))])])
  }))])])])])])])])]) : _c('div', {
    staticClass: "loading-content"
  }, [_c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12 text-center"
  }, [_c('h3', [_vm._v("Loading...")])])])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "breadcramb-content breadcramb-v2 pt25 pb25 parallax-bg color-overlay",
    staticStyle: {
      "background-image": "url(img/footer-bg.jpg)"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-6"
  }, [_c('h3', [_vm._v("LATEST TRANSACTIONS")])]), _vm._v(" "), _c('div', {
    staticClass: "col-sm-6"
  }, [_c('ul', [_c('li', [_c('a', {
    attrs: {
      "href": "/"
    }
  }, [_vm._v("Home")])]), _vm._v(" "), _c('li', [_vm._v("Latest Transactions")])])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section-padding gray-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12"
  }, [_c('div', {
    staticClass: "section-title text-center mb30"
  }, [_c('h2', [_vm._v("Latest 50 transactions")]), _vm._v(" "), _c('p', [_vm._v("This page displays the latest 50 confirmed transactions in the Ubiq chain.")]), _vm._v(" "), _c('div', {
    staticClass: "section-divider divider-traingle"
  })])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('thead', {
    staticClass: "thead-dark"
  }, [_c('tr', [_c('th', [_vm._v("Details")]), _vm._v(" "), _c('th', {
    staticClass: "visible-lg"
  }, [_vm._v("From")]), _vm._v(" "), _c('th', {
    staticClass: "visible-lg"
  }, [_vm._v("To")]), _vm._v(" "), _c('th', [_vm._v("Value")]), _vm._v(" "), _c('th', {
    staticClass: "visible-md"
  }, [_vm._v("Date (UTC)")])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(1).rerender("data-v-54f055fb", module.exports)
  }
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._m(0), _vm._v(" "), (_vm.block == null) ? _c('div', {
    staticClass: "loading-content",
    attrs: {
      "e": ""
    }
  }, [_vm._m(1)]) : (_vm.block.found == true) ? _c('div', [_c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12"
  }, [_c('div', {
    staticClass: "section-title text-center mb30"
  }, [_c('h2', [_vm._v("Block " + _vm._s(_vm.block.blockNumber))]), _vm._v(" "), _c('div', {
    staticClass: "section-divider divider-traingle"
  })])])])])]), _vm._v(" "), _c('section', {
    staticClass: "section-padding gray-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-md-8 col-sm-9"
  }, [_c('div', {
    staticClass: "featured-box white-bg"
  }, [_c('h4', [_vm._v("Block details")]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Number:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.blockNumber))]), _vm._v(" "), _c('dt', [_vm._v("Found on (UTC):")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.foundOnFormatted))]), _vm._v(" "), _c('dt', [_vm._v("Transactions:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.numberOfTransactions))])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Miner:")]), _vm._v(" "), _c('dd', [_c('router-link', {
    attrs: {
      "to": {
        name: 'account',
        params: {
          address: _vm.block.miner
        }
      }
    }
  }, [_vm._v(_vm._s(_vm.block.miner))])], 1)]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Hash:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.hash))]), _vm._v(" "), _c('dt', [_vm._v("Parent Hash:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.parentHash))]), _vm._v(" "), _c('dt', [_vm._v("Nonce:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.nonce))]), _vm._v(" "), _c('dt', [_vm._v("Sha3 Uncles:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.sha3Uncles))]), _vm._v(" "), _c('dt', [_vm._v("Transactions root:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.transactionsRoot))]), _vm._v(" "), _c('dt', [_vm._v("State root:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.stateRoot))]), _vm._v(" "), _c('dt', [_vm._v("Extra data:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.extraData))])])])]), _vm._v(" "), _c('div', {
    staticClass: "col-md-4 col-sm-3"
  }, [_c('div', {
    staticClass: "featured-box white-bg"
  }, [_c('h4', [_vm._v("Difficulty / Gas")]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Dificulty:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.difficulty))]), _vm._v(" "), _c('dt', [_vm._v("Total difficulty:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.totalDifficulty))])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Gas limit:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.gasLimit))]), _vm._v(" "), _c('dt', [_vm._v("Gas used:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.gasUsed))])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('dl', [_c('dt', [_vm._v("Size:")]), _vm._v(" "), _c('dd', [_vm._v(_vm._s(_vm.block.size))])])])])])])]), _vm._v(" "), (_vm.block.transactions.length) ? _c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-12 col-lg-12"
  }, [_c('div', {
    staticClass: "cart-price"
  }, [_c('h3', [_vm._v("Transactions")]), _vm._v(" "), _c('table', {
    staticClass: "table table-striped"
  }, [_c('thead', {
    staticClass: "thead-dark"
  }, [_c('tr', [_c('th', [_vm._v("Details")]), _vm._v(" "), _c('th', {
    staticClass: "visible-lg"
  }, [_vm._v("From")]), _vm._v(" "), _c('th', {
    staticClass: "visible-lg"
  }, [_vm._v("To")]), _vm._v(" "), _c('th', [_vm._v("Value")]), _vm._v(" "), _c('th', {
    staticClass: "visible-md"
  }, [_vm._v("Date (UTC)")])])]), _vm._v(" "), _c('tbody', _vm._l((_vm.block.transactions), function(item) {
    return _c('tr', {}, [_c('td', [(item.originalTransactionHash == null) ? _c('span', [_c('router-link', {
      staticClass: "gridlink",
      attrs: {
        "to": {
          name: 'transaction',
          params: {
            transactionHash: item.transactionHash
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.transactionHash, 20)))])], 1) : _c('span', [_c('router-link', {
      staticClass: "gridlink",
      attrs: {
        "to": {
          name: 'transaction',
          params: {
            transactionHash: item.originalTransactionHash
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.originalTransactionHash, 20)))])], 1)]), _vm._v(" "), _c('td', {
      staticClass: "visible-lg"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'account',
          params: {
            address: item.from
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.from, 20)))])], 1), _vm._v(" "), _c('td', {
      staticClass: "visible-lg"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'account',
          params: {
            address: item.to
          }
        }
      }
    }, [_vm._v(_vm._s(_vm.subStr(item.to, 20)))])], 1), _vm._v(" "), _c('td', [_vm._v(_vm._s(item.value) + " " + _vm._s(item.symbol))]), _vm._v(" "), _c('td', {
      staticClass: "visible-md"
    }, [_vm._v(_vm._s(item.confirmedOnFormatted))])])
  }))])])])])])]) : _vm._e()]) : _c('div', [_c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12"
  }, [_c('div', {
    staticClass: "section-title text-center mb30"
  }, [_c('h4', [_vm._v("Block not found")]), _vm._v(" "), _c('div', {
    staticClass: "section-divider divider-traingle"
  })])])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "breadcramb-content breadcramb-v2 pt25 pb25 parallax-bg color-overlay",
    staticStyle: {
      "background-image": "url(img/footer-bg.jpg)"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-6"
  }, [_c('h3', [_vm._v("BLOCK")])]), _vm._v(" "), _c('div', {
    staticClass: "col-sm-6"
  }, [_c('ul', [_c('li', [_c('a', {
    attrs: {
      "href": "/"
    }
  }, [_vm._v("Home")])]), _vm._v(" "), _c('li', [_vm._v("Block")])])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12 text-center"
  }, [_c('h3', [_vm._v("Loading...")])])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(1).rerender("data-v-5e3849c2", module.exports)
  }
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "top-search",
    staticStyle: {
      "display": "block"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "input-group"
  }, [_vm._m(0), _vm._v(" "), _c('input', {
    staticClass: "form-control",
    attrs: {
      "type": "text",
      "placeholder": "Block number, tx hash, address..."
    },
    on: {
      "keyup": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.submit($event)
      }
    }
  }), _vm._v(" "), _vm._m(1)])])]), _vm._v(" "), _c('div', {
    staticClass: "container"
  }, [_vm._m(2), _vm._v(" "), _vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "collapse navbar-collapse",
    attrs: {
      "id": "navbar-menu"
    }
  }, [_c('ul', {
    staticClass: "nav navbar-nav navbar-right",
    attrs: {
      "data-in": "fadeInUp",
      "data-out": "fadeOutDown"
    }
  }, [_c('li', [_c('router-link', {
    attrs: {
      "to": "/",
      "exact": true
    }
  }, [_vm._v("\n                        Home\n                    ")])], 1), _vm._v(" "), _c('li', [_c('router-link', {
    attrs: {
      "to": "/blocks"
    }
  }, [_vm._v("\n                        Blocks\n                    ")])], 1), _vm._v(" "), _c('li', [_c('router-link', {
    attrs: {
      "to": "/transactions"
    }
  }, [_vm._v("\n                        Transactions\n                    ")])], 1), _vm._v(" "), _c('li', [_c('router-link', {
    attrs: {
      "to": "/pendingtransactions"
    }
  }, [_vm._v("\n                        Pending Transactions\n                    ")])], 1), _vm._v(" "), _c('li', [_c('router-link', {
    attrs: {
      "to": "/tokens"
    }
  }, [_vm._v("\n                        Tokens\n                    ")])], 1), _vm._v(" "), _c('li', [_c('router-link', {
    attrs: {
      "to": "/miningpools"
    }
  }, [_vm._v("\n                        Mining Pools\n                    ")])], 1), _vm._v(" "), _vm._m(4)])])]), _vm._v(" "), _vm._m(5)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', {
    staticClass: "input-group-addon"
  }, [_c('i', {
    staticClass: "fa fa-search"
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', {
    staticClass: "input-group-addon close-search"
  }, [_c('i', {
    staticClass: "fa fa-times"
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "attr-nav"
  }, [_c('ul', [_c('li', {
    staticClass: "search-icon"
  }, [_c('a', {
    attrs: {
      "href": "#"
    }
  }, [_c('i', {
    staticClass: "fa fa-search"
  })])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "navbar-header"
  }, [_c('button', {
    staticClass: "navbar-toggle",
    attrs: {
      "type": "button",
      "data-toggle": "collapse",
      "data-target": "#navbar-menu"
    }
  }, [_c('i', {
    staticClass: "fa fa-bars"
  })]), _vm._v(" "), _c('a', {
    staticClass: "navbar-brand",
    attrs: {
      "href": "/"
    }
  }, [_c('img', {
    staticClass: "logo",
    attrs: {
      "src": "img/logo.png",
      "alt": ""
    }
  })])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', [_c('a', {
    attrs: {
      "href": "/swagger",
      "target": "_blank"
    }
  }, [_vm._v("API")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "side"
  }, [_c('a', {
    staticClass: "close-side",
    attrs: {
      "href": "#"
    }
  }, [_c('i', {
    staticClass: "fa fa-times"
  })]), _vm._v(" "), _c('div', {
    staticClass: "widget"
  }, [_c('h6', {
    staticClass: "title"
  }, [_vm._v("Custom Pages")]), _vm._v(" "), _c('ul', {
    staticClass: "link"
  }, [_c('li', [_c('a', {
    attrs: {
      "href": "/"
    }
  }, [_vm._v("Home")])])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(1).rerender("data-v-63a1f175", module.exports)
  }
}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('section', {
    staticClass: "section-padding white-bg"
  }, [(_vm.tokens.length) ? _c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-lg-12"
  }, [_c('div', {
    staticClass: "card card-borderless"
  }, [_c('div', {
    staticClass: "tab-content"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-12 col-lg-12"
  }, [(_vm.tokens.length) ? _c('table', {
    staticClass: "table table-striped"
  }, [_vm._m(2), _vm._v(" "), _c('tbody', _vm._l((_vm.tokens), function(item) {
    return _c('tr', [_c('td', {
      staticStyle: {
        "padding-left": "10px",
        "padding-top": "2px!important",
        "padding-bottom": "0px!important"
      }
    }, [(item.logo != null) ? _c('span', [_c('img', {
      attrs: {
        "src": item.logo,
        "title": item.name
      }
    })]) : _vm._e()]), _vm._v(" "), _c('td', [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(item.symbol))]), _vm._v(" "), _c('td', {
      staticClass: "visible-lg"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'account',
          params: {
            address: item.address
          }
        }
      }
    }, [_vm._v(_vm._s(item.address))])], 1), _vm._v(" "), _c('td', [_vm._v(_vm._s(item.standard))]), _vm._v(" "), _c('td', [(item.website != null) ? _c('span', [_c('a', {
      attrs: {
        "href": item.website,
        "target": "_blank"
      }
    }, [_vm._v("Click here")])]) : _vm._e()]), _vm._v(" "), _c('td', [(item.price > 0) ? _c('span', [_vm._v("$" + _vm._s(_vm.formatCurrency(item.price)))]) : _vm._e()])])
  }))]) : _vm._e()])])])])])])]) : _c('div', {
    staticClass: "loading-content"
  }, [_c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12 text-center"
  }, [_c('h3', [_vm._v("Loading...")])])])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "breadcramb-content breadcramb-v2 pt25 pb25 parallax-bg color-overlay",
    staticStyle: {
      "background-image": "url(img/footer-bg.jpg)"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-6"
  }, [_c('h3', [_vm._v("TOKENS")])]), _vm._v(" "), _c('div', {
    staticClass: "col-sm-6"
  }, [_c('ul', [_c('li', [_c('a', {
    attrs: {
      "href": "/"
    }
  }, [_vm._v("Home")])]), _vm._v(" "), _c('li', [_vm._v("Tokens")])])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section-padding gray-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12"
  }, [_c('div', {
    staticClass: "section-title text-center mb30"
  }, [_c('h2', [_vm._v("Tokens")]), _vm._v(" "), _c('p', [_vm._v("This page displays a list of known tokens on the Ubiq network.")]), _vm._v(" "), _c('p', [_vm._v("Have you published a token on the Ubiq network and would you like to see it listed here? Then please contact us.")]), _vm._v(" "), _c('p', [_vm._v("If your token meets the ERC20 requirements, we'll also be happy to show the balance of your token on account pages.")]), _vm._v(" "), _c('div', {
    staticClass: "section-divider divider-traingle"
  })])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('thead', {
    staticClass: "thead-dark"
  }, [_c('tr', [_c('th'), _vm._v(" "), _c('th', [_vm._v("Name")]), _vm._v(" "), _c('th', [_vm._v("Symbol")]), _vm._v(" "), _c('th', {
    staticClass: "visible-lg"
  }, [_vm._v("Address")]), _vm._v(" "), _c('th', [_vm._v("Standard")]), _vm._v(" "), _c('th', [_vm._v("Website")]), _vm._v(" "), _c('th', [_vm._v("Current price")])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(1).rerender("data-v-6510f63b", module.exports)
  }
}

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('section', {
    staticClass: "section-padding white-bg"
  }, [(_vm.blocks.length) ? _c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-lg-12"
  }, [_c('div', {
    staticClass: "card card-borderless"
  }, [_c('div', {
    staticClass: "tab-content"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-12 col-lg-12"
  }, [(_vm.blocks.length) ? _c('table', {
    staticClass: "table table-striped"
  }, [_vm._m(2), _vm._v(" "), _c('tbody', _vm._l((_vm.blocks), function(item) {
    return _c('tr', [_c('td', [_c('router-link', {
      attrs: {
        "to": {
          name: 'block',
          params: {
            blockNumber: item.blockNumber
          }
        }
      }
    }, [_vm._v(_vm._s(item.blockNumber))])], 1), _vm._v(" "), _c('td', {
      staticClass: "visible-lg"
    }, [_vm._v(_vm._s(item.hash))]), _vm._v(" "), _c('td', {
      staticClass: "visible-lg"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'account',
          params: {
            address: item.miner
          }
        }
      }
    }, [_vm._v(_vm._s(item.miner))])], 1), _vm._v(" "), _c('td', {
      staticClass: "text-right"
    }, [_vm._v(_vm._s(item.numberOfTransactions))])])
  }))]) : _vm._e()])])])])])])]) : _c('div', {
    staticClass: "loading-content"
  }, [_c('section', {
    staticClass: "section-padding white-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12 text-center"
  }, [_c('h3', [_vm._v("Loading...")])])])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "breadcramb-content breadcramb-v2 pt25 pb25 parallax-bg color-overlay",
    staticStyle: {
      "background-image": "url(img/footer-bg.jpg)"
    }
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-6"
  }, [_c('h3', [_vm._v("LATEST BLOCKS")])]), _vm._v(" "), _c('div', {
    staticClass: "col-sm-6"
  }, [_c('ul', [_c('li', [_c('a', {
    attrs: {
      "href": "/"
    }
  }, [_vm._v("Home")])]), _vm._v(" "), _c('li', [_vm._v("Latest Blocks")])])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "section-padding gray-bg"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-sm-12"
  }, [_c('div', {
    staticClass: "section-title text-center mb30"
  }, [_c('h2', [_vm._v("Latest 50 blocks")]), _vm._v(" "), _c('p', [_vm._v("This page displays the latest 50 confirmed blocks in the Ubiq chain.")]), _vm._v(" "), _c('div', {
    staticClass: "section-divider divider-traingle"
  })])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('thead', {
    staticClass: "thead-dark"
  }, [_c('tr', [_c('th', [_vm._v("Number")]), _vm._v(" "), _c('th', {
    staticClass: "visible-lg"
  }, [_vm._v("Hash")]), _vm._v(" "), _c('th', {
    staticClass: "visible-lg"
  }, [_vm._v("Miner")]), _vm._v(" "), _c('th', {
    staticClass: "text-right"
  }, [_vm._v("Transactions")])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(1).rerender("data-v-fa5f64ca", module.exports)
  }
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(65)("1fedaa80", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(9, function() {
     var newContent = __webpack_require__(9);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(66)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 66 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__(15);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__(27).AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { ignoreUnaccepted: true };

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(1);

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(19);

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(4))(5);

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(14);
__webpack_require__(13);
module.exports = __webpack_require__(12);


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map