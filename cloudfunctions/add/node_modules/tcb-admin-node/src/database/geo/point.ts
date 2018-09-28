import { Validate } from "../validate";

/**
 * 地址位置
 *
 * @author haroldhu
 */
export class Point {
  /**
   * 纬度
   * [-90, 90]
   */
  readonly latitude: number;

  /**
   * 经度
   * [-180, 180]
   */
  readonly longitude: number;

  /**
   * 初始化
   *
   * @param latitude    - 纬度 [-90, 90]
   * @param longitude   - 经度 [-180, 180]
   */
  constructor(longitude: number, latitude: number) {
    Validate.isGeopoint("latitude", latitude);
    Validate.isGeopoint("longitude", longitude);

    this.latitude = latitude;
    this.longitude = longitude;
  }

}
