"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseConsumer = void 0;
class BaseConsumer {
    init(ctx) {
        this.ctx = ctx;
        this.app = ctx.app;
        this.config = ctx.app.config;
        return this;
    }
}
exports.BaseConsumer = BaseConsumer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZUNvbnN1bWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFzZUNvbnN1bWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQXNCLFlBQVk7SUFLaEMsSUFBSSxDQUFDLEdBQVk7UUFDZixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUdGO0FBYkQsb0NBYUMifQ==