import { FieldType, UpdateOperatorList } from "./constant";
import { Point } from "./geo/point";
import { Command } from "./command";
import * as deepAssign from "deep-assign";
import { ServerDate } from "./serverDate";

interface DocumentModel {
  _id: string;
}

/**
 * 后端要求的地理位置格式
 */
interface GeoPointRes {
  type: "Point";
  coordinates: number[];
}

/**
 * 工具模块
 *
 * @author haroldhu
 */
export class Util {
  /**
   * 编码为后端格式的地理位置数据
   *
   * @internal
   */
  private static encodeGeoPoint = (point: Point): GeoPointRes => {
    if (!(point instanceof Point)) {
      throw new Error("encodeGeoPoint: must be GeoPoint type");
    }
    return {
      type: "Point",
      coordinates: [point.latitude, point.longitude]
    };
  };

  private static encodeServerDate = (serverDate: ServerDate): object => {
    return { $date: { offset: serverDate.offset } }
  }

  /**
   * 编码为后端格式的日期数据
   *
   * @internal
   */
  private static encodeTimestamp = (stamp: Date) => {
    if (!(stamp instanceof Date)) {
      throw new Error("encodeTimestamp: must be Date type");
    }
    return {
      $timestamp: Math.floor(stamp.getTime() / 1000)
    };
  };

  /**
   * 编码为后端数据格式
   *
   * 主要递归对象和数组，目的是处理地理位置和时间戳
   *
   * @param document - 前端文档数据
   */
  public static encodeDocumentDataForReq = (document, merge = false, concatKey = true) => {
    const keys = Object.keys(document);
    let params = {};

    // 数组递归的情况
    if (Array.isArray(document)) {
      params = [];
    }
    // console.log(document);

    const getCommandVal = (key, item) => {
      let value
      let command = new Command();
      let tmp = command.concatKeys({ [key]: item });
      // console.log(tmp)
      if (tmp.value instanceof Command) {
        value = tmp.value.parse(tmp.keys);
      } else {
        value = { [tmp.keys]: tmp.value }
      }

      return value
    }

    keys.forEach(key => {
      const item = document[key];
      const type = Util.whichType(item);
      let realValue;
      if (type === FieldType.GeoPoint) {
        realValue = { [key]: Util.encodeGeoPoint(item).coordinates };
      } else if (type === FieldType.Timestamp) {
        realValue = { [key]: Util.encodeTimestamp(item) };
      } else if (type === FieldType.ServerDate) {
        realValue = { [key]: Util.encodeServerDate(item) };
      } else if (type === FieldType.Object) {
        if (concatKey) {
          realValue = getCommandVal(key, item)
        } else {
          realValue = { [key]: Util.encodeDocumentDataForReq(item, merge, concatKey) };
        }
      } else if (type === FieldType.Command) {
        realValue = getCommandVal(key, item)
      } else {
        realValue = { [key]: item };
      }

      if (UpdateOperatorList.indexOf(Object.keys(realValue)[0]) === -1 && merge === true) {
        realValue = { $set: realValue }
      }

      if (Array.isArray(params)) {
        params.push(realValue);
      } else {
        // params[key] = realValue;
        params = deepAssign({}, params, realValue);
      }
    });
    // console.log(params)
    return params;
  };

  /**
   * 格式化后端返回的文档数据
   *
   * @param document - 后端文档数据
   */
  public static formatResDocumentData = (documents: DocumentModel[]) => {
    return documents.map(document => {
      return Util.formatField(document);
    });
  };

  /**
   * 格式化字段
   *
   * 主要是递归数组和对象，把地理位置和日期时间转换为js对象。
   *
   * @param document
   * @internal
   */
  private static formatField = document => {
    const keys = Object.keys(document);
    let protoField = {};

    // 数组递归的情况
    if (Array.isArray(document)) {
      protoField = [];
    }

    keys.forEach(key => {
      const item = document[key];
      const type = Util.whichType(item);
      // console.log(type, item)
      let realValue;
      switch (type) {
        case FieldType.GeoPoint:
          realValue = new Point(item.coordinates[0], item.coordinates[1]);
          break;
        case FieldType.Timestamp:
          realValue = new Date(item.$timestamp * 1000);
          break;
        case FieldType.Object:
        case FieldType.Array:
          realValue = Util.formatField(item);
          break;
        case FieldType.ServerDate:
          realValue = new Date(item.$date);
          break;

        default:
          realValue = item;

      }

      if (Array.isArray(protoField)) {
        protoField.push(realValue);
      } else {
        protoField[key] = realValue;
      }
      // console.log(protoField)
    });
    return protoField;
  };

  /**
   * 查看数据类型
   *
   * @param obj
   */
  public static whichType = (obj: any): String => {
    let type = Object.prototype.toString.call(obj).slice(8, -1);

    if (type === FieldType.Object) {
      // console.log(obj)
      if (obj instanceof Point) {
        return FieldType.GeoPoint;
      } else if (obj instanceof Date) {
        return FieldType.Timestamp;
      } else if (obj instanceof Command) {
        return FieldType.Command;
      } else if (obj instanceof ServerDate) {
        return FieldType.ServerDate
      }

      if (obj.$timestamp) {
        type = FieldType.Timestamp;
      } else if (obj.$date) {
        type = FieldType.ServerDate;
      } else if (Array.isArray(obj.coordinates) && obj.type === "Point") {
        type = FieldType.GeoPoint;
      }
    }
    return type;
  };

  /**
   * 生成文档ID
   *
   * 为创建新文档使用
   */
  public static generateDocId = () => {
    let chars = "ABCDEFabcdef0123456789";
    let autoId = "";
    for (let i = 0; i < 24; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
  };
}
