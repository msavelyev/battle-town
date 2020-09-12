/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Block = $root.Block = (() => {

    /**
     * Properties of a Block.
     * @exports IBlock
     * @interface IBlock
     * @property {IEntity|null} [entity] Block entity
     * @property {BlockType|null} [type] Block type
     */

    /**
     * Constructs a new Block.
     * @exports Block
     * @classdesc Represents a Block.
     * @implements IBlock
     * @constructor
     * @param {IBlock=} [properties] Properties to set
     */
    function Block(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Block entity.
     * @member {IEntity|null|undefined} entity
     * @memberof Block
     * @instance
     */
    Block.prototype.entity = null;

    /**
     * Block type.
     * @member {BlockType} type
     * @memberof Block
     * @instance
     */
    Block.prototype.type = 0;

    /**
     * Creates a new Block instance using the specified properties.
     * @function create
     * @memberof Block
     * @static
     * @param {IBlock=} [properties] Properties to set
     * @returns {Block} Block instance
     */
    Block.create = function create(properties) {
        return new Block(properties);
    };

    /**
     * Encodes the specified Block message. Does not implicitly {@link Block.verify|verify} messages.
     * @function encode
     * @memberof Block
     * @static
     * @param {IBlock} message Block message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Block.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.entity != null && Object.hasOwnProperty.call(message, "entity"))
            $root.Entity.encode(message.entity, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
        return writer;
    };

    /**
     * Encodes the specified Block message, length delimited. Does not implicitly {@link Block.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Block
     * @static
     * @param {IBlock} message Block message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Block.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Block message from the specified reader or buffer.
     * @function decode
     * @memberof Block
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Block} Block
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Block.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Block();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.entity = $root.Entity.decode(reader, reader.uint32());
                break;
            case 2:
                message.type = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Block message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Block
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Block} Block
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Block.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Block message.
     * @function verify
     * @memberof Block
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Block.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.entity != null && message.hasOwnProperty("entity")) {
            let error = $root.Entity.verify(message.entity);
            if (error)
                return "entity." + error;
        }
        if (message.type != null && message.hasOwnProperty("type"))
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            }
        return null;
    };

    /**
     * Creates a Block message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Block
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Block} Block
     */
    Block.fromObject = function fromObject(object) {
        if (object instanceof $root.Block)
            return object;
        let message = new $root.Block();
        if (object.entity != null) {
            if (typeof object.entity !== "object")
                throw TypeError(".Block.entity: object expected");
            message.entity = $root.Entity.fromObject(object.entity);
        }
        switch (object.type) {
        case "EMPTY":
        case 0:
            message.type = 0;
            break;
        case "STONE":
        case 1:
            message.type = 1;
            break;
        case "BRICK":
        case 2:
            message.type = 2;
            break;
        case "WATER":
        case 3:
            message.type = 3;
            break;
        case "JUNGLE":
        case 4:
            message.type = 4;
            break;
        case "SPAWN":
        case 5:
            message.type = 5;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from a Block message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Block
     * @static
     * @param {Block} message Block
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Block.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.entity = null;
            object.type = options.enums === String ? "EMPTY" : 0;
        }
        if (message.entity != null && message.hasOwnProperty("entity"))
            object.entity = $root.Entity.toObject(message.entity, options);
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.BlockType[message.type] : message.type;
        return object;
    };

    /**
     * Converts this Block to JSON.
     * @function toJSON
     * @memberof Block
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Block.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Block;
})();

/**
 * BlockType enum.
 * @exports BlockType
 * @enum {number}
 * @property {number} EMPTY=0 EMPTY value
 * @property {number} STONE=1 STONE value
 * @property {number} BRICK=2 BRICK value
 * @property {number} WATER=3 WATER value
 * @property {number} JUNGLE=4 JUNGLE value
 * @property {number} SPAWN=5 SPAWN value
 */
$root.BlockType = (function() {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "EMPTY"] = 0;
    values[valuesById[1] = "STONE"] = 1;
    values[valuesById[2] = "BRICK"] = 2;
    values[valuesById[3] = "WATER"] = 3;
    values[valuesById[4] = "JUNGLE"] = 4;
    values[valuesById[5] = "SPAWN"] = 5;
    return values;
})();

export const Bullet = $root.Bullet = (() => {

    /**
     * Properties of a Bullet.
     * @exports IBullet
     * @interface IBullet
     * @property {IEntity|null} [entity] Bullet entity
     * @property {Direction|null} [direction] Bullet direction
     */

    /**
     * Constructs a new Bullet.
     * @exports Bullet
     * @classdesc Represents a Bullet.
     * @implements IBullet
     * @constructor
     * @param {IBullet=} [properties] Properties to set
     */
    function Bullet(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Bullet entity.
     * @member {IEntity|null|undefined} entity
     * @memberof Bullet
     * @instance
     */
    Bullet.prototype.entity = null;

    /**
     * Bullet direction.
     * @member {Direction} direction
     * @memberof Bullet
     * @instance
     */
    Bullet.prototype.direction = 0;

    /**
     * Creates a new Bullet instance using the specified properties.
     * @function create
     * @memberof Bullet
     * @static
     * @param {IBullet=} [properties] Properties to set
     * @returns {Bullet} Bullet instance
     */
    Bullet.create = function create(properties) {
        return new Bullet(properties);
    };

    /**
     * Encodes the specified Bullet message. Does not implicitly {@link Bullet.verify|verify} messages.
     * @function encode
     * @memberof Bullet
     * @static
     * @param {IBullet} message Bullet message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Bullet.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.entity != null && Object.hasOwnProperty.call(message, "entity"))
            $root.Entity.encode(message.entity, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.direction);
        return writer;
    };

    /**
     * Encodes the specified Bullet message, length delimited. Does not implicitly {@link Bullet.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Bullet
     * @static
     * @param {IBullet} message Bullet message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Bullet.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Bullet message from the specified reader or buffer.
     * @function decode
     * @memberof Bullet
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Bullet} Bullet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Bullet.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Bullet();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.entity = $root.Entity.decode(reader, reader.uint32());
                break;
            case 2:
                message.direction = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Bullet message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Bullet
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Bullet} Bullet
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Bullet.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Bullet message.
     * @function verify
     * @memberof Bullet
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Bullet.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.entity != null && message.hasOwnProperty("entity")) {
            let error = $root.Entity.verify(message.entity);
            if (error)
                return "entity." + error;
        }
        if (message.direction != null && message.hasOwnProperty("direction"))
            switch (message.direction) {
            default:
                return "direction: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        return null;
    };

    /**
     * Creates a Bullet message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Bullet
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Bullet} Bullet
     */
    Bullet.fromObject = function fromObject(object) {
        if (object instanceof $root.Bullet)
            return object;
        let message = new $root.Bullet();
        if (object.entity != null) {
            if (typeof object.entity !== "object")
                throw TypeError(".Bullet.entity: object expected");
            message.entity = $root.Entity.fromObject(object.entity);
        }
        switch (object.direction) {
        case "UP":
        case 0:
            message.direction = 0;
            break;
        case "DOWN":
        case 1:
            message.direction = 1;
            break;
        case "LEFT":
        case 2:
            message.direction = 2;
            break;
        case "RIGHT":
        case 3:
            message.direction = 3;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from a Bullet message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Bullet
     * @static
     * @param {Bullet} message Bullet
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Bullet.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.entity = null;
            object.direction = options.enums === String ? "UP" : 0;
        }
        if (message.entity != null && message.hasOwnProperty("entity"))
            object.entity = $root.Entity.toObject(message.entity, options);
        if (message.direction != null && message.hasOwnProperty("direction"))
            object.direction = options.enums === String ? $root.Direction[message.direction] : message.direction;
        return object;
    };

    /**
     * Converts this Bullet to JSON.
     * @function toJSON
     * @memberof Bullet
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Bullet.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Bullet;
})();

export const Configuration = $root.Configuration = (() => {

    /**
     * Properties of a Configuration.
     * @exports IConfiguration
     * @interface IConfiguration
     * @property {string|null} [id] Configuration id
     * @property {IMatch|null} [match] Configuration match
     */

    /**
     * Constructs a new Configuration.
     * @exports Configuration
     * @classdesc Represents a Configuration.
     * @implements IConfiguration
     * @constructor
     * @param {IConfiguration=} [properties] Properties to set
     */
    function Configuration(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Configuration id.
     * @member {string} id
     * @memberof Configuration
     * @instance
     */
    Configuration.prototype.id = "";

    /**
     * Configuration match.
     * @member {IMatch|null|undefined} match
     * @memberof Configuration
     * @instance
     */
    Configuration.prototype.match = null;

    /**
     * Creates a new Configuration instance using the specified properties.
     * @function create
     * @memberof Configuration
     * @static
     * @param {IConfiguration=} [properties] Properties to set
     * @returns {Configuration} Configuration instance
     */
    Configuration.create = function create(properties) {
        return new Configuration(properties);
    };

    /**
     * Encodes the specified Configuration message. Does not implicitly {@link Configuration.verify|verify} messages.
     * @function encode
     * @memberof Configuration
     * @static
     * @param {IConfiguration} message Configuration message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Configuration.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.match != null && Object.hasOwnProperty.call(message, "match"))
            $root.Match.encode(message.match, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Configuration message, length delimited. Does not implicitly {@link Configuration.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Configuration
     * @static
     * @param {IConfiguration} message Configuration message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Configuration.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Configuration message from the specified reader or buffer.
     * @function decode
     * @memberof Configuration
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Configuration} Configuration
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Configuration.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Configuration();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.match = $root.Match.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Configuration message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Configuration
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Configuration} Configuration
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Configuration.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Configuration message.
     * @function verify
     * @memberof Configuration
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Configuration.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.match != null && message.hasOwnProperty("match")) {
            let error = $root.Match.verify(message.match);
            if (error)
                return "match." + error;
        }
        return null;
    };

    /**
     * Creates a Configuration message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Configuration
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Configuration} Configuration
     */
    Configuration.fromObject = function fromObject(object) {
        if (object instanceof $root.Configuration)
            return object;
        let message = new $root.Configuration();
        if (object.id != null)
            message.id = String(object.id);
        if (object.match != null) {
            if (typeof object.match !== "object")
                throw TypeError(".Configuration.match: object expected");
            message.match = $root.Match.fromObject(object.match);
        }
        return message;
    };

    /**
     * Creates a plain object from a Configuration message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Configuration
     * @static
     * @param {Configuration} message Configuration
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Configuration.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = "";
            object.match = null;
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.match != null && message.hasOwnProperty("match"))
            object.match = $root.Match.toObject(message.match, options);
        return object;
    };

    /**
     * Converts this Configuration to JSON.
     * @function toJSON
     * @memberof Configuration
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Configuration.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Configuration;
})();

/**
 * Direction enum.
 * @exports Direction
 * @enum {number}
 * @property {number} UP=0 UP value
 * @property {number} DOWN=1 DOWN value
 * @property {number} LEFT=2 LEFT value
 * @property {number} RIGHT=3 RIGHT value
 */
$root.Direction = (function() {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "UP"] = 0;
    values[valuesById[1] = "DOWN"] = 1;
    values[valuesById[2] = "LEFT"] = 2;
    values[valuesById[3] = "RIGHT"] = 3;
    return values;
})();

export const Entity = $root.Entity = (() => {

    /**
     * Properties of an Entity.
     * @exports IEntity
     * @interface IEntity
     * @property {string|null} [id] Entity id
     * @property {EntityType|null} [entityType] Entity entityType
     * @property {IPoint|null} [position] Entity position
     * @property {number|null} [size] Entity size
     */

    /**
     * Constructs a new Entity.
     * @exports Entity
     * @classdesc Represents an Entity.
     * @implements IEntity
     * @constructor
     * @param {IEntity=} [properties] Properties to set
     */
    function Entity(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Entity id.
     * @member {string} id
     * @memberof Entity
     * @instance
     */
    Entity.prototype.id = "";

    /**
     * Entity entityType.
     * @member {EntityType} entityType
     * @memberof Entity
     * @instance
     */
    Entity.prototype.entityType = 0;

    /**
     * Entity position.
     * @member {IPoint|null|undefined} position
     * @memberof Entity
     * @instance
     */
    Entity.prototype.position = null;

    /**
     * Entity size.
     * @member {number} size
     * @memberof Entity
     * @instance
     */
    Entity.prototype.size = 0;

    /**
     * Creates a new Entity instance using the specified properties.
     * @function create
     * @memberof Entity
     * @static
     * @param {IEntity=} [properties] Properties to set
     * @returns {Entity} Entity instance
     */
    Entity.create = function create(properties) {
        return new Entity(properties);
    };

    /**
     * Encodes the specified Entity message. Does not implicitly {@link Entity.verify|verify} messages.
     * @function encode
     * @memberof Entity
     * @static
     * @param {IEntity} message Entity message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Entity.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.entityType != null && Object.hasOwnProperty.call(message, "entityType"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.entityType);
        if (message.position != null && Object.hasOwnProperty.call(message, "position"))
            $root.Point.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.size != null && Object.hasOwnProperty.call(message, "size"))
            writer.uint32(/* id 4, wireType 5 =*/37).float(message.size);
        return writer;
    };

    /**
     * Encodes the specified Entity message, length delimited. Does not implicitly {@link Entity.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Entity
     * @static
     * @param {IEntity} message Entity message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Entity.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Entity message from the specified reader or buffer.
     * @function decode
     * @memberof Entity
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Entity} Entity
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Entity.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Entity();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.entityType = reader.int32();
                break;
            case 3:
                message.position = $root.Point.decode(reader, reader.uint32());
                break;
            case 4:
                message.size = reader.float();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Entity message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Entity
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Entity} Entity
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Entity.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Entity message.
     * @function verify
     * @memberof Entity
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Entity.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.entityType != null && message.hasOwnProperty("entityType"))
            switch (message.entityType) {
            default:
                return "entityType: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        if (message.position != null && message.hasOwnProperty("position")) {
            let error = $root.Point.verify(message.position);
            if (error)
                return "position." + error;
        }
        if (message.size != null && message.hasOwnProperty("size"))
            if (typeof message.size !== "number")
                return "size: number expected";
        return null;
    };

    /**
     * Creates an Entity message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Entity
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Entity} Entity
     */
    Entity.fromObject = function fromObject(object) {
        if (object instanceof $root.Entity)
            return object;
        let message = new $root.Entity();
        if (object.id != null)
            message.id = String(object.id);
        switch (object.entityType) {
        case "BLOCK":
        case 0:
            message.entityType = 0;
            break;
        case "TANK":
        case 1:
            message.entityType = 1;
            break;
        case "BULLET":
        case 2:
            message.entityType = 2;
            break;
        case "EXPLOSION":
        case 3:
            message.entityType = 3;
            break;
        }
        if (object.position != null) {
            if (typeof object.position !== "object")
                throw TypeError(".Entity.position: object expected");
            message.position = $root.Point.fromObject(object.position);
        }
        if (object.size != null)
            message.size = Number(object.size);
        return message;
    };

    /**
     * Creates a plain object from an Entity message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Entity
     * @static
     * @param {Entity} message Entity
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Entity.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = "";
            object.entityType = options.enums === String ? "BLOCK" : 0;
            object.position = null;
            object.size = 0;
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.entityType != null && message.hasOwnProperty("entityType"))
            object.entityType = options.enums === String ? $root.EntityType[message.entityType] : message.entityType;
        if (message.position != null && message.hasOwnProperty("position"))
            object.position = $root.Point.toObject(message.position, options);
        if (message.size != null && message.hasOwnProperty("size"))
            object.size = options.json && !isFinite(message.size) ? String(message.size) : message.size;
        return object;
    };

    /**
     * Converts this Entity to JSON.
     * @function toJSON
     * @memberof Entity
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Entity.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Entity;
})();

/**
 * EntityType enum.
 * @exports EntityType
 * @enum {number}
 * @property {number} BLOCK=0 BLOCK value
 * @property {number} TANK=1 TANK value
 * @property {number} BULLET=2 BULLET value
 * @property {number} EXPLOSION=3 EXPLOSION value
 */
$root.EntityType = (function() {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "BLOCK"] = 0;
    values[valuesById[1] = "TANK"] = 1;
    values[valuesById[2] = "BULLET"] = 2;
    values[valuesById[3] = "EXPLOSION"] = 3;
    return values;
})();

export const Explosion = $root.Explosion = (() => {

    /**
     * Properties of an Explosion.
     * @exports IExplosion
     * @interface IExplosion
     * @property {IEntity|null} [entity] Explosion entity
     * @property {number|null} [tick] Explosion tick
     */

    /**
     * Constructs a new Explosion.
     * @exports Explosion
     * @classdesc Represents an Explosion.
     * @implements IExplosion
     * @constructor
     * @param {IExplosion=} [properties] Properties to set
     */
    function Explosion(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Explosion entity.
     * @member {IEntity|null|undefined} entity
     * @memberof Explosion
     * @instance
     */
    Explosion.prototype.entity = null;

    /**
     * Explosion tick.
     * @member {number} tick
     * @memberof Explosion
     * @instance
     */
    Explosion.prototype.tick = 0;

    /**
     * Creates a new Explosion instance using the specified properties.
     * @function create
     * @memberof Explosion
     * @static
     * @param {IExplosion=} [properties] Properties to set
     * @returns {Explosion} Explosion instance
     */
    Explosion.create = function create(properties) {
        return new Explosion(properties);
    };

    /**
     * Encodes the specified Explosion message. Does not implicitly {@link Explosion.verify|verify} messages.
     * @function encode
     * @memberof Explosion
     * @static
     * @param {IExplosion} message Explosion message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Explosion.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.entity != null && Object.hasOwnProperty.call(message, "entity"))
            $root.Entity.encode(message.entity, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.tick);
        return writer;
    };

    /**
     * Encodes the specified Explosion message, length delimited. Does not implicitly {@link Explosion.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Explosion
     * @static
     * @param {IExplosion} message Explosion message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Explosion.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Explosion message from the specified reader or buffer.
     * @function decode
     * @memberof Explosion
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Explosion} Explosion
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Explosion.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Explosion();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.entity = $root.Entity.decode(reader, reader.uint32());
                break;
            case 2:
                message.tick = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Explosion message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Explosion
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Explosion} Explosion
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Explosion.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Explosion message.
     * @function verify
     * @memberof Explosion
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Explosion.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.entity != null && message.hasOwnProperty("entity")) {
            let error = $root.Entity.verify(message.entity);
            if (error)
                return "entity." + error;
        }
        if (message.tick != null && message.hasOwnProperty("tick"))
            if (!$util.isInteger(message.tick))
                return "tick: integer expected";
        return null;
    };

    /**
     * Creates an Explosion message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Explosion
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Explosion} Explosion
     */
    Explosion.fromObject = function fromObject(object) {
        if (object instanceof $root.Explosion)
            return object;
        let message = new $root.Explosion();
        if (object.entity != null) {
            if (typeof object.entity !== "object")
                throw TypeError(".Explosion.entity: object expected");
            message.entity = $root.Entity.fromObject(object.entity);
        }
        if (object.tick != null)
            message.tick = object.tick | 0;
        return message;
    };

    /**
     * Creates a plain object from an Explosion message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Explosion
     * @static
     * @param {Explosion} message Explosion
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Explosion.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.entity = null;
            object.tick = 0;
        }
        if (message.entity != null && message.hasOwnProperty("entity"))
            object.entity = $root.Entity.toObject(message.entity, options);
        if (message.tick != null && message.hasOwnProperty("tick"))
            object.tick = message.tick;
        return object;
    };

    /**
     * Converts this Explosion to JSON.
     * @function toJSON
     * @memberof Explosion
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Explosion.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Explosion;
})();

export const Match = $root.Match = (() => {

    /**
     * Properties of a Match.
     * @exports IMatch
     * @interface IMatch
     * @property {MatchState|null} [state] Match state
     * @property {Array.<IUser>|null} [users] Match users
     * @property {IWorld|null} [world] Match world
     * @property {Object.<string,number>|null} [score] Match score
     * @property {number|null} [tick] Match tick
     * @property {Object.<string,number>|null} [ack] Match ack
     * @property {number|null} [levelId] Match levelId
     * @property {number|null} [stateSinceTick] Match stateSinceTick
     * @property {number|null} [nextStateOnTick] Match nextStateOnTick
     * @property {string|null} [stateSpotlight] Match stateSpotlight
     */

    /**
     * Constructs a new Match.
     * @exports Match
     * @classdesc Represents a Match.
     * @implements IMatch
     * @constructor
     * @param {IMatch=} [properties] Properties to set
     */
    function Match(properties) {
        this.users = [];
        this.score = {};
        this.ack = {};
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Match state.
     * @member {MatchState} state
     * @memberof Match
     * @instance
     */
    Match.prototype.state = 0;

    /**
     * Match users.
     * @member {Array.<IUser>} users
     * @memberof Match
     * @instance
     */
    Match.prototype.users = $util.emptyArray;

    /**
     * Match world.
     * @member {IWorld|null|undefined} world
     * @memberof Match
     * @instance
     */
    Match.prototype.world = null;

    /**
     * Match score.
     * @member {Object.<string,number>} score
     * @memberof Match
     * @instance
     */
    Match.prototype.score = $util.emptyObject;

    /**
     * Match tick.
     * @member {number} tick
     * @memberof Match
     * @instance
     */
    Match.prototype.tick = 0;

    /**
     * Match ack.
     * @member {Object.<string,number>} ack
     * @memberof Match
     * @instance
     */
    Match.prototype.ack = $util.emptyObject;

    /**
     * Match levelId.
     * @member {number} levelId
     * @memberof Match
     * @instance
     */
    Match.prototype.levelId = 0;

    /**
     * Match stateSinceTick.
     * @member {number} stateSinceTick
     * @memberof Match
     * @instance
     */
    Match.prototype.stateSinceTick = 0;

    /**
     * Match nextStateOnTick.
     * @member {number} nextStateOnTick
     * @memberof Match
     * @instance
     */
    Match.prototype.nextStateOnTick = 0;

    /**
     * Match stateSpotlight.
     * @member {string} stateSpotlight
     * @memberof Match
     * @instance
     */
    Match.prototype.stateSpotlight = "";

    /**
     * Creates a new Match instance using the specified properties.
     * @function create
     * @memberof Match
     * @static
     * @param {IMatch=} [properties] Properties to set
     * @returns {Match} Match instance
     */
    Match.create = function create(properties) {
        return new Match(properties);
    };

    /**
     * Encodes the specified Match message. Does not implicitly {@link Match.verify|verify} messages.
     * @function encode
     * @memberof Match
     * @static
     * @param {IMatch} message Match message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Match.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.state != null && Object.hasOwnProperty.call(message, "state"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.state);
        if (message.users != null && message.users.length)
            for (let i = 0; i < message.users.length; ++i)
                $root.User.encode(message.users[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.world != null && Object.hasOwnProperty.call(message, "world"))
            $root.World.encode(message.world, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.score != null && Object.hasOwnProperty.call(message, "score"))
            for (let keys = Object.keys(message.score), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 0 =*/16).int32(message.score[keys[i]]).ldelim();
        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.tick);
        if (message.ack != null && Object.hasOwnProperty.call(message, "ack"))
            for (let keys = Object.keys(message.ack), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 6, wireType 2 =*/50).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 0 =*/16).int32(message.ack[keys[i]]).ldelim();
        if (message.levelId != null && Object.hasOwnProperty.call(message, "levelId"))
            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.levelId);
        if (message.stateSinceTick != null && Object.hasOwnProperty.call(message, "stateSinceTick"))
            writer.uint32(/* id 8, wireType 0 =*/64).int32(message.stateSinceTick);
        if (message.nextStateOnTick != null && Object.hasOwnProperty.call(message, "nextStateOnTick"))
            writer.uint32(/* id 9, wireType 0 =*/72).int32(message.nextStateOnTick);
        if (message.stateSpotlight != null && Object.hasOwnProperty.call(message, "stateSpotlight"))
            writer.uint32(/* id 10, wireType 2 =*/82).string(message.stateSpotlight);
        return writer;
    };

    /**
     * Encodes the specified Match message, length delimited. Does not implicitly {@link Match.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Match
     * @static
     * @param {IMatch} message Match message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Match.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Match message from the specified reader or buffer.
     * @function decode
     * @memberof Match
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Match} Match
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Match.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Match(), key;
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.state = reader.int32();
                break;
            case 2:
                if (!(message.users && message.users.length))
                    message.users = [];
                message.users.push($root.User.decode(reader, reader.uint32()));
                break;
            case 3:
                message.world = $root.World.decode(reader, reader.uint32());
                break;
            case 4:
                reader.skip().pos++;
                if (message.score === $util.emptyObject)
                    message.score = {};
                key = reader.string();
                reader.pos++;
                message.score[key] = reader.int32();
                break;
            case 5:
                message.tick = reader.int32();
                break;
            case 6:
                reader.skip().pos++;
                if (message.ack === $util.emptyObject)
                    message.ack = {};
                key = reader.string();
                reader.pos++;
                message.ack[key] = reader.int32();
                break;
            case 7:
                message.levelId = reader.int32();
                break;
            case 8:
                message.stateSinceTick = reader.int32();
                break;
            case 9:
                message.nextStateOnTick = reader.int32();
                break;
            case 10:
                message.stateSpotlight = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Match message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Match
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Match} Match
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Match.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Match message.
     * @function verify
     * @memberof Match
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Match.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.state != null && message.hasOwnProperty("state"))
            switch (message.state) {
            default:
                return "state: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
                break;
            }
        if (message.users != null && message.hasOwnProperty("users")) {
            if (!Array.isArray(message.users))
                return "users: array expected";
            for (let i = 0; i < message.users.length; ++i) {
                let error = $root.User.verify(message.users[i]);
                if (error)
                    return "users." + error;
            }
        }
        if (message.world != null && message.hasOwnProperty("world")) {
            let error = $root.World.verify(message.world);
            if (error)
                return "world." + error;
        }
        if (message.score != null && message.hasOwnProperty("score")) {
            if (!$util.isObject(message.score))
                return "score: object expected";
            let key = Object.keys(message.score);
            for (let i = 0; i < key.length; ++i)
                if (!$util.isInteger(message.score[key[i]]))
                    return "score: integer{k:string} expected";
        }
        if (message.tick != null && message.hasOwnProperty("tick"))
            if (!$util.isInteger(message.tick))
                return "tick: integer expected";
        if (message.ack != null && message.hasOwnProperty("ack")) {
            if (!$util.isObject(message.ack))
                return "ack: object expected";
            let key = Object.keys(message.ack);
            for (let i = 0; i < key.length; ++i)
                if (!$util.isInteger(message.ack[key[i]]))
                    return "ack: integer{k:string} expected";
        }
        if (message.levelId != null && message.hasOwnProperty("levelId"))
            if (!$util.isInteger(message.levelId))
                return "levelId: integer expected";
        if (message.stateSinceTick != null && message.hasOwnProperty("stateSinceTick"))
            if (!$util.isInteger(message.stateSinceTick))
                return "stateSinceTick: integer expected";
        if (message.nextStateOnTick != null && message.hasOwnProperty("nextStateOnTick"))
            if (!$util.isInteger(message.nextStateOnTick))
                return "nextStateOnTick: integer expected";
        if (message.stateSpotlight != null && message.hasOwnProperty("stateSpotlight"))
            if (!$util.isString(message.stateSpotlight))
                return "stateSpotlight: string expected";
        return null;
    };

    /**
     * Creates a Match message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Match
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Match} Match
     */
    Match.fromObject = function fromObject(object) {
        if (object instanceof $root.Match)
            return object;
        let message = new $root.Match();
        switch (object.state) {
        case "PREPARE":
        case 0:
            message.state = 0;
            break;
        case "READY":
        case 1:
            message.state = 1;
            break;
        case "PLAY":
        case 2:
            message.state = 2;
            break;
        case "SCORE":
        case 3:
            message.state = 3;
            break;
        case "FINISHED":
        case 4:
            message.state = 4;
            break;
        }
        if (object.users) {
            if (!Array.isArray(object.users))
                throw TypeError(".Match.users: array expected");
            message.users = [];
            for (let i = 0; i < object.users.length; ++i) {
                if (typeof object.users[i] !== "object")
                    throw TypeError(".Match.users: object expected");
                message.users[i] = $root.User.fromObject(object.users[i]);
            }
        }
        if (object.world != null) {
            if (typeof object.world !== "object")
                throw TypeError(".Match.world: object expected");
            message.world = $root.World.fromObject(object.world);
        }
        if (object.score) {
            if (typeof object.score !== "object")
                throw TypeError(".Match.score: object expected");
            message.score = {};
            for (let keys = Object.keys(object.score), i = 0; i < keys.length; ++i)
                message.score[keys[i]] = object.score[keys[i]] | 0;
        }
        if (object.tick != null)
            message.tick = object.tick | 0;
        if (object.ack) {
            if (typeof object.ack !== "object")
                throw TypeError(".Match.ack: object expected");
            message.ack = {};
            for (let keys = Object.keys(object.ack), i = 0; i < keys.length; ++i)
                message.ack[keys[i]] = object.ack[keys[i]] | 0;
        }
        if (object.levelId != null)
            message.levelId = object.levelId | 0;
        if (object.stateSinceTick != null)
            message.stateSinceTick = object.stateSinceTick | 0;
        if (object.nextStateOnTick != null)
            message.nextStateOnTick = object.nextStateOnTick | 0;
        if (object.stateSpotlight != null)
            message.stateSpotlight = String(object.stateSpotlight);
        return message;
    };

    /**
     * Creates a plain object from a Match message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Match
     * @static
     * @param {Match} message Match
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Match.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.users = [];
        if (options.objects || options.defaults) {
            object.score = {};
            object.ack = {};
        }
        if (options.defaults) {
            object.state = options.enums === String ? "PREPARE" : 0;
            object.world = null;
            object.tick = 0;
            object.levelId = 0;
            object.stateSinceTick = 0;
            object.nextStateOnTick = 0;
            object.stateSpotlight = "";
        }
        if (message.state != null && message.hasOwnProperty("state"))
            object.state = options.enums === String ? $root.MatchState[message.state] : message.state;
        if (message.users && message.users.length) {
            object.users = [];
            for (let j = 0; j < message.users.length; ++j)
                object.users[j] = $root.User.toObject(message.users[j], options);
        }
        if (message.world != null && message.hasOwnProperty("world"))
            object.world = $root.World.toObject(message.world, options);
        let keys2;
        if (message.score && (keys2 = Object.keys(message.score)).length) {
            object.score = {};
            for (let j = 0; j < keys2.length; ++j)
                object.score[keys2[j]] = message.score[keys2[j]];
        }
        if (message.tick != null && message.hasOwnProperty("tick"))
            object.tick = message.tick;
        if (message.ack && (keys2 = Object.keys(message.ack)).length) {
            object.ack = {};
            for (let j = 0; j < keys2.length; ++j)
                object.ack[keys2[j]] = message.ack[keys2[j]];
        }
        if (message.levelId != null && message.hasOwnProperty("levelId"))
            object.levelId = message.levelId;
        if (message.stateSinceTick != null && message.hasOwnProperty("stateSinceTick"))
            object.stateSinceTick = message.stateSinceTick;
        if (message.nextStateOnTick != null && message.hasOwnProperty("nextStateOnTick"))
            object.nextStateOnTick = message.nextStateOnTick;
        if (message.stateSpotlight != null && message.hasOwnProperty("stateSpotlight"))
            object.stateSpotlight = message.stateSpotlight;
        return object;
    };

    /**
     * Converts this Match to JSON.
     * @function toJSON
     * @memberof Match
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Match.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Match;
})();

/**
 * MatchState enum.
 * @exports MatchState
 * @enum {number}
 * @property {number} PREPARE=0 PREPARE value
 * @property {number} READY=1 READY value
 * @property {number} PLAY=2 PLAY value
 * @property {number} SCORE=3 SCORE value
 * @property {number} FINISHED=4 FINISHED value
 */
$root.MatchState = (function() {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "PREPARE"] = 0;
    values[valuesById[1] = "READY"] = 1;
    values[valuesById[2] = "PLAY"] = 2;
    values[valuesById[3] = "SCORE"] = 3;
    values[valuesById[4] = "FINISHED"] = 4;
    return values;
})();

export const Point = $root.Point = (() => {

    /**
     * Properties of a Point.
     * @exports IPoint
     * @interface IPoint
     * @property {number|null} [x] Point x
     * @property {number|null} [y] Point y
     */

    /**
     * Constructs a new Point.
     * @exports Point
     * @classdesc Represents a Point.
     * @implements IPoint
     * @constructor
     * @param {IPoint=} [properties] Properties to set
     */
    function Point(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Point x.
     * @member {number} x
     * @memberof Point
     * @instance
     */
    Point.prototype.x = 0;

    /**
     * Point y.
     * @member {number} y
     * @memberof Point
     * @instance
     */
    Point.prototype.y = 0;

    /**
     * Creates a new Point instance using the specified properties.
     * @function create
     * @memberof Point
     * @static
     * @param {IPoint=} [properties] Properties to set
     * @returns {Point} Point instance
     */
    Point.create = function create(properties) {
        return new Point(properties);
    };

    /**
     * Encodes the specified Point message. Does not implicitly {@link Point.verify|verify} messages.
     * @function encode
     * @memberof Point
     * @static
     * @param {IPoint} message Point message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Point.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.x != null && Object.hasOwnProperty.call(message, "x"))
            writer.uint32(/* id 1, wireType 1 =*/9).double(message.x);
        if (message.y != null && Object.hasOwnProperty.call(message, "y"))
            writer.uint32(/* id 2, wireType 1 =*/17).double(message.y);
        return writer;
    };

    /**
     * Encodes the specified Point message, length delimited. Does not implicitly {@link Point.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Point
     * @static
     * @param {IPoint} message Point message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Point.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Point message from the specified reader or buffer.
     * @function decode
     * @memberof Point
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Point} Point
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Point.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Point();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.x = reader.double();
                break;
            case 2:
                message.y = reader.double();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Point message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Point
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Point} Point
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Point.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Point message.
     * @function verify
     * @memberof Point
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Point.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.x != null && message.hasOwnProperty("x"))
            if (typeof message.x !== "number")
                return "x: number expected";
        if (message.y != null && message.hasOwnProperty("y"))
            if (typeof message.y !== "number")
                return "y: number expected";
        return null;
    };

    /**
     * Creates a Point message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Point
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Point} Point
     */
    Point.fromObject = function fromObject(object) {
        if (object instanceof $root.Point)
            return object;
        let message = new $root.Point();
        if (object.x != null)
            message.x = Number(object.x);
        if (object.y != null)
            message.y = Number(object.y);
        return message;
    };

    /**
     * Creates a plain object from a Point message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Point
     * @static
     * @param {Point} message Point
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Point.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.x = 0;
            object.y = 0;
        }
        if (message.x != null && message.hasOwnProperty("x"))
            object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
        if (message.y != null && message.hasOwnProperty("y"))
            object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
        return object;
    };

    /**
     * Converts this Point to JSON.
     * @function toJSON
     * @memberof Point
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Point.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Point;
})();

export const Tank = $root.Tank = (() => {

    /**
     * Properties of a Tank.
     * @exports ITank
     * @interface ITank
     * @property {IEntity|null} [entity] Tank entity
     * @property {string|null} [name] Tank name
     * @property {Direction|null} [direction] Tank direction
     */

    /**
     * Constructs a new Tank.
     * @exports Tank
     * @classdesc Represents a Tank.
     * @implements ITank
     * @constructor
     * @param {ITank=} [properties] Properties to set
     */
    function Tank(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Tank entity.
     * @member {IEntity|null|undefined} entity
     * @memberof Tank
     * @instance
     */
    Tank.prototype.entity = null;

    /**
     * Tank name.
     * @member {string} name
     * @memberof Tank
     * @instance
     */
    Tank.prototype.name = "";

    /**
     * Tank direction.
     * @member {Direction} direction
     * @memberof Tank
     * @instance
     */
    Tank.prototype.direction = 0;

    /**
     * Creates a new Tank instance using the specified properties.
     * @function create
     * @memberof Tank
     * @static
     * @param {ITank=} [properties] Properties to set
     * @returns {Tank} Tank instance
     */
    Tank.create = function create(properties) {
        return new Tank(properties);
    };

    /**
     * Encodes the specified Tank message. Does not implicitly {@link Tank.verify|verify} messages.
     * @function encode
     * @memberof Tank
     * @static
     * @param {ITank} message Tank message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Tank.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.entity != null && Object.hasOwnProperty.call(message, "entity"))
            $root.Entity.encode(message.entity, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
        if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.direction);
        return writer;
    };

    /**
     * Encodes the specified Tank message, length delimited. Does not implicitly {@link Tank.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Tank
     * @static
     * @param {ITank} message Tank message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Tank.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Tank message from the specified reader or buffer.
     * @function decode
     * @memberof Tank
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Tank} Tank
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Tank.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Tank();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.entity = $root.Entity.decode(reader, reader.uint32());
                break;
            case 2:
                message.name = reader.string();
                break;
            case 3:
                message.direction = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Tank message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Tank
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Tank} Tank
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Tank.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Tank message.
     * @function verify
     * @memberof Tank
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Tank.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.entity != null && message.hasOwnProperty("entity")) {
            let error = $root.Entity.verify(message.entity);
            if (error)
                return "entity." + error;
        }
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.direction != null && message.hasOwnProperty("direction"))
            switch (message.direction) {
            default:
                return "direction: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        return null;
    };

    /**
     * Creates a Tank message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Tank
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Tank} Tank
     */
    Tank.fromObject = function fromObject(object) {
        if (object instanceof $root.Tank)
            return object;
        let message = new $root.Tank();
        if (object.entity != null) {
            if (typeof object.entity !== "object")
                throw TypeError(".Tank.entity: object expected");
            message.entity = $root.Entity.fromObject(object.entity);
        }
        if (object.name != null)
            message.name = String(object.name);
        switch (object.direction) {
        case "UP":
        case 0:
            message.direction = 0;
            break;
        case "DOWN":
        case 1:
            message.direction = 1;
            break;
        case "LEFT":
        case 2:
            message.direction = 2;
            break;
        case "RIGHT":
        case 3:
            message.direction = 3;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from a Tank message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Tank
     * @static
     * @param {Tank} message Tank
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Tank.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.entity = null;
            object.name = "";
            object.direction = options.enums === String ? "UP" : 0;
        }
        if (message.entity != null && message.hasOwnProperty("entity"))
            object.entity = $root.Entity.toObject(message.entity, options);
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.direction != null && message.hasOwnProperty("direction"))
            object.direction = options.enums === String ? $root.Direction[message.direction] : message.direction;
        return object;
    };

    /**
     * Converts this Tank to JSON.
     * @function toJSON
     * @memberof Tank
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Tank.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Tank;
})();

export const User = $root.User = (() => {

    /**
     * Properties of a User.
     * @exports IUser
     * @interface IUser
     * @property {string|null} [id] User id
     * @property {string|null} [name] User name
     */

    /**
     * Constructs a new User.
     * @exports User
     * @classdesc Represents a User.
     * @implements IUser
     * @constructor
     * @param {IUser=} [properties] Properties to set
     */
    function User(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * User id.
     * @member {string} id
     * @memberof User
     * @instance
     */
    User.prototype.id = "";

    /**
     * User name.
     * @member {string} name
     * @memberof User
     * @instance
     */
    User.prototype.name = "";

    /**
     * Creates a new User instance using the specified properties.
     * @function create
     * @memberof User
     * @static
     * @param {IUser=} [properties] Properties to set
     * @returns {User} User instance
     */
    User.create = function create(properties) {
        return new User(properties);
    };

    /**
     * Encodes the specified User message. Does not implicitly {@link User.verify|verify} messages.
     * @function encode
     * @memberof User
     * @static
     * @param {IUser} message User message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    User.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
        return writer;
    };

    /**
     * Encodes the specified User message, length delimited. Does not implicitly {@link User.verify|verify} messages.
     * @function encodeDelimited
     * @memberof User
     * @static
     * @param {IUser} message User message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    User.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a User message from the specified reader or buffer.
     * @function decode
     * @memberof User
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {User} User
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    User.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.User();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.name = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a User message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof User
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {User} User
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    User.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a User message.
     * @function verify
     * @memberof User
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    User.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        return null;
    };

    /**
     * Creates a User message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof User
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {User} User
     */
    User.fromObject = function fromObject(object) {
        if (object instanceof $root.User)
            return object;
        let message = new $root.User();
        if (object.id != null)
            message.id = String(object.id);
        if (object.name != null)
            message.name = String(object.name);
        return message;
    };

    /**
     * Creates a plain object from a User message. Also converts values to other types if specified.
     * @function toObject
     * @memberof User
     * @static
     * @param {User} message User
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    User.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = "";
            object.name = "";
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        return object;
    };

    /**
     * Converts this User to JSON.
     * @function toJSON
     * @memberof User
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    User.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return User;
})();

export const World = $root.World = (() => {

    /**
     * Properties of a World.
     * @exports IWorld
     * @interface IWorld
     * @property {string|null} [id] World id
     * @property {number|null} [width] World width
     * @property {number|null} [height] World height
     * @property {Array.<IBlock>|null} [blocks] World blocks
     * @property {Array.<ITank>|null} [tanks] World tanks
     * @property {Array.<IBullet>|null} [bullets] World bullets
     * @property {Array.<IExplosion>|null} [explosions] World explosions
     */

    /**
     * Constructs a new World.
     * @exports World
     * @classdesc Represents a World.
     * @implements IWorld
     * @constructor
     * @param {IWorld=} [properties] Properties to set
     */
    function World(properties) {
        this.blocks = [];
        this.tanks = [];
        this.bullets = [];
        this.explosions = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * World id.
     * @member {string} id
     * @memberof World
     * @instance
     */
    World.prototype.id = "";

    /**
     * World width.
     * @member {number} width
     * @memberof World
     * @instance
     */
    World.prototype.width = 0;

    /**
     * World height.
     * @member {number} height
     * @memberof World
     * @instance
     */
    World.prototype.height = 0;

    /**
     * World blocks.
     * @member {Array.<IBlock>} blocks
     * @memberof World
     * @instance
     */
    World.prototype.blocks = $util.emptyArray;

    /**
     * World tanks.
     * @member {Array.<ITank>} tanks
     * @memberof World
     * @instance
     */
    World.prototype.tanks = $util.emptyArray;

    /**
     * World bullets.
     * @member {Array.<IBullet>} bullets
     * @memberof World
     * @instance
     */
    World.prototype.bullets = $util.emptyArray;

    /**
     * World explosions.
     * @member {Array.<IExplosion>} explosions
     * @memberof World
     * @instance
     */
    World.prototype.explosions = $util.emptyArray;

    /**
     * Creates a new World instance using the specified properties.
     * @function create
     * @memberof World
     * @static
     * @param {IWorld=} [properties] Properties to set
     * @returns {World} World instance
     */
    World.create = function create(properties) {
        return new World(properties);
    };

    /**
     * Encodes the specified World message. Does not implicitly {@link World.verify|verify} messages.
     * @function encode
     * @memberof World
     * @static
     * @param {IWorld} message World message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    World.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.width);
        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.height);
        if (message.blocks != null && message.blocks.length)
            for (let i = 0; i < message.blocks.length; ++i)
                $root.Block.encode(message.blocks[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.tanks != null && message.tanks.length)
            for (let i = 0; i < message.tanks.length; ++i)
                $root.Tank.encode(message.tanks[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.bullets != null && message.bullets.length)
            for (let i = 0; i < message.bullets.length; ++i)
                $root.Bullet.encode(message.bullets[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        if (message.explosions != null && message.explosions.length)
            for (let i = 0; i < message.explosions.length; ++i)
                $root.Explosion.encode(message.explosions[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified World message, length delimited. Does not implicitly {@link World.verify|verify} messages.
     * @function encodeDelimited
     * @memberof World
     * @static
     * @param {IWorld} message World message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    World.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a World message from the specified reader or buffer.
     * @function decode
     * @memberof World
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {World} World
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    World.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.World();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.width = reader.int32();
                break;
            case 3:
                message.height = reader.int32();
                break;
            case 4:
                if (!(message.blocks && message.blocks.length))
                    message.blocks = [];
                message.blocks.push($root.Block.decode(reader, reader.uint32()));
                break;
            case 5:
                if (!(message.tanks && message.tanks.length))
                    message.tanks = [];
                message.tanks.push($root.Tank.decode(reader, reader.uint32()));
                break;
            case 6:
                if (!(message.bullets && message.bullets.length))
                    message.bullets = [];
                message.bullets.push($root.Bullet.decode(reader, reader.uint32()));
                break;
            case 7:
                if (!(message.explosions && message.explosions.length))
                    message.explosions = [];
                message.explosions.push($root.Explosion.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a World message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof World
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {World} World
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    World.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a World message.
     * @function verify
     * @memberof World
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    World.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.width != null && message.hasOwnProperty("width"))
            if (!$util.isInteger(message.width))
                return "width: integer expected";
        if (message.height != null && message.hasOwnProperty("height"))
            if (!$util.isInteger(message.height))
                return "height: integer expected";
        if (message.blocks != null && message.hasOwnProperty("blocks")) {
            if (!Array.isArray(message.blocks))
                return "blocks: array expected";
            for (let i = 0; i < message.blocks.length; ++i) {
                let error = $root.Block.verify(message.blocks[i]);
                if (error)
                    return "blocks." + error;
            }
        }
        if (message.tanks != null && message.hasOwnProperty("tanks")) {
            if (!Array.isArray(message.tanks))
                return "tanks: array expected";
            for (let i = 0; i < message.tanks.length; ++i) {
                let error = $root.Tank.verify(message.tanks[i]);
                if (error)
                    return "tanks." + error;
            }
        }
        if (message.bullets != null && message.hasOwnProperty("bullets")) {
            if (!Array.isArray(message.bullets))
                return "bullets: array expected";
            for (let i = 0; i < message.bullets.length; ++i) {
                let error = $root.Bullet.verify(message.bullets[i]);
                if (error)
                    return "bullets." + error;
            }
        }
        if (message.explosions != null && message.hasOwnProperty("explosions")) {
            if (!Array.isArray(message.explosions))
                return "explosions: array expected";
            for (let i = 0; i < message.explosions.length; ++i) {
                let error = $root.Explosion.verify(message.explosions[i]);
                if (error)
                    return "explosions." + error;
            }
        }
        return null;
    };

    /**
     * Creates a World message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof World
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {World} World
     */
    World.fromObject = function fromObject(object) {
        if (object instanceof $root.World)
            return object;
        let message = new $root.World();
        if (object.id != null)
            message.id = String(object.id);
        if (object.width != null)
            message.width = object.width | 0;
        if (object.height != null)
            message.height = object.height | 0;
        if (object.blocks) {
            if (!Array.isArray(object.blocks))
                throw TypeError(".World.blocks: array expected");
            message.blocks = [];
            for (let i = 0; i < object.blocks.length; ++i) {
                if (typeof object.blocks[i] !== "object")
                    throw TypeError(".World.blocks: object expected");
                message.blocks[i] = $root.Block.fromObject(object.blocks[i]);
            }
        }
        if (object.tanks) {
            if (!Array.isArray(object.tanks))
                throw TypeError(".World.tanks: array expected");
            message.tanks = [];
            for (let i = 0; i < object.tanks.length; ++i) {
                if (typeof object.tanks[i] !== "object")
                    throw TypeError(".World.tanks: object expected");
                message.tanks[i] = $root.Tank.fromObject(object.tanks[i]);
            }
        }
        if (object.bullets) {
            if (!Array.isArray(object.bullets))
                throw TypeError(".World.bullets: array expected");
            message.bullets = [];
            for (let i = 0; i < object.bullets.length; ++i) {
                if (typeof object.bullets[i] !== "object")
                    throw TypeError(".World.bullets: object expected");
                message.bullets[i] = $root.Bullet.fromObject(object.bullets[i]);
            }
        }
        if (object.explosions) {
            if (!Array.isArray(object.explosions))
                throw TypeError(".World.explosions: array expected");
            message.explosions = [];
            for (let i = 0; i < object.explosions.length; ++i) {
                if (typeof object.explosions[i] !== "object")
                    throw TypeError(".World.explosions: object expected");
                message.explosions[i] = $root.Explosion.fromObject(object.explosions[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a World message. Also converts values to other types if specified.
     * @function toObject
     * @memberof World
     * @static
     * @param {World} message World
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    World.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults) {
            object.blocks = [];
            object.tanks = [];
            object.bullets = [];
            object.explosions = [];
        }
        if (options.defaults) {
            object.id = "";
            object.width = 0;
            object.height = 0;
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.width != null && message.hasOwnProperty("width"))
            object.width = message.width;
        if (message.height != null && message.hasOwnProperty("height"))
            object.height = message.height;
        if (message.blocks && message.blocks.length) {
            object.blocks = [];
            for (let j = 0; j < message.blocks.length; ++j)
                object.blocks[j] = $root.Block.toObject(message.blocks[j], options);
        }
        if (message.tanks && message.tanks.length) {
            object.tanks = [];
            for (let j = 0; j < message.tanks.length; ++j)
                object.tanks[j] = $root.Tank.toObject(message.tanks[j], options);
        }
        if (message.bullets && message.bullets.length) {
            object.bullets = [];
            for (let j = 0; j < message.bullets.length; ++j)
                object.bullets[j] = $root.Bullet.toObject(message.bullets[j], options);
        }
        if (message.explosions && message.explosions.length) {
            object.explosions = [];
            for (let j = 0; j < message.explosions.length; ++j)
                object.explosions[j] = $root.Explosion.toObject(message.explosions[j], options);
        }
        return object;
    };

    /**
     * Converts this World to JSON.
     * @function toJSON
     * @memberof World
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    World.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return World;
})();

export { $root as default };
