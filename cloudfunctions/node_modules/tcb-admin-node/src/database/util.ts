import { FieldType } from "./constant";
import { Point } from "./geo/point";
import { ServerDate } from "./serverDate";

interface DocumentModel {
  _id: string;
}


/**
 * 工具模块
 *
 * @author haroldhu
 */
export class Util {

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
          realValue = new Date(item.$date);
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
      }/* else if (obj instanceof Command) {
        return FieldType.Command;
      } */else if (obj instanceof ServerDate) {
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
