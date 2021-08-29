"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextId = void 0;
const path = require("path");
const assert = require("assert");
const uuid_1 = require("uuid");
const is = require("is-type-of");
const typedi_1 = require("typedi");
exports.contextId = Symbol('rabbitMqConsumerContextId');
typedi_1.Container.of = function (instanceId) {
    if (instanceId === undefined)
        // @ts-ignore
        return this.globalInstance;
    // @ts-ignore
    var container = this.instances.find(function (instance) { return instance.id === instanceId; });
    if (!container) {
        container = new typedi_1.ContainerInstance(instanceId);
        // @ts-ignore
        container.services.push(...this.globalInstance.services.map(s => (Object.assign(Object.assign({}, s), { value: s.global ? s.value : undefined }))));
        // @ts-ignore
        this.instances.push(container);
    }
    return container;
};
exports.default = app => {
    const dirs = app.loader.getLoadUnits().map(unit => path.join(unit.path, 'app/consumer'));
    dirs.push(...app.config.rabbitmq.consumer.directory);
    const Loader = getConsumerLoader(app);
    const consumers = (app.consumers = {});
    new Loader({
        directory: dirs,
        target: consumers,
        inject: app,
    }).load();
    return consumers;
};
const initCtx = (target, ctx) => {
    target.ctx = ctx;
    target.app = ctx.app;
    target.config = ctx.app.config;
    target.service = ctx.service;
    target[exports.contextId] = ctx[exports.contextId];
};
const injectContext = (obj, ctx) => {
    Object.getOwnPropertyNames(obj).map(prop => {
        if (obj[prop] && typeof obj[prop] === 'object') {
            const type = obj[prop].constructor;
            if (obj[exports.contextId] !== ctx[exports.contextId] && (typedi_1.Container.has(type) || typedi_1.Container.has(type.name))) {
                injectContext(obj[prop], ctx);
                initCtx(obj[prop], ctx);
            }
        }
    });
};
function getConsumerLoader(app) {
    return class ConsumerLoader extends app.loader.FileLoader {
        load() {
            // @ts-ignore
            const target = this.options.target;
            const items = this.parse();
            for (const item of items) {
                const consumer = item.exports;
                const fullpath = item.fullpath;
                const config = consumer.config;
                assert(config, `consumer(${fullpath}): must have config and subscribe properties`);
                assert(config.queue, `consumer(${fullpath}): consumer.config must have queue properties`);
                assert(is.class(consumer) || is.function(consumer.subscribe), `consumer(${fullpath}: consumer.subscribe should be function or consumer should be class`);
                let subscribe;
                if (is.class(consumer)) {
                    subscribe = ctx => async (data) => {
                        ctx[exports.contextId] = uuid_1.v1();
                        const instance = typedi_1.Container.of(ctx[exports.contextId]).get(consumer);
                        injectContext(instance, ctx);
                        initCtx(instance, ctx);
                        instance.subscribe = app.toAsyncFunction(instance.subscribe);
                        const ret = await instance.subscribe(data);
                        typedi_1.Container.reset(ctx[exports.contextId]);
                        return ret;
                    };
                }
                else {
                    subscribe = () => app.toAsyncFunction(consumer.subscribe);
                }
                const env = app.config.env;
                const envList = config.env;
                if (is.array(envList) && !envList.includes(env)) {
                    app.coreLogger.info(`[egg-rabbitmq]: ignore consumer ${fullpath} due to \`consumer.env\` not match`);
                    continue;
                }
                target[fullpath] = {
                    consumer: config,
                    subscribe,
                    key: fullpath,
                };
            }
            return target;
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE2QjtBQUM3QixpQ0FBaUM7QUFDakMsK0JBQW9DO0FBRXBDLGlDQUFrQztBQUNsQyxtQ0FBc0Q7QUFFekMsUUFBQSxTQUFTLEdBQUcsTUFBTSxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFFN0Qsa0JBQVMsQ0FBQyxFQUFFLEdBQUcsVUFBVSxVQUFVO0lBQ2pDLElBQUksVUFBVSxLQUFLLFNBQVM7UUFDMUIsYUFBYTtRQUNiLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixhQUFhO0lBQ2QsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxRQUFRLElBQUksT0FBTyxRQUFRLENBQUMsRUFBRSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hHLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDYixTQUFTLEdBQUcsSUFBSSwwQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxhQUFhO1FBQ2YsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxpQ0FDN0QsQ0FBQyxLQUNKLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsYUFBYTtRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbEIsQ0FBQyxDQUFDO0FBRUYsa0JBQWUsR0FBRyxDQUFDLEVBQUU7SUFDbkIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFD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