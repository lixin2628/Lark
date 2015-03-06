//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////



module lark {
    /**
     * Matrix 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。
     * 您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix 对象应用于 Transform 对象的 matrix 属性，
     * 然后应用该 Transform 对象作为显示对象的 transform 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。
     */
    export class Matrix extends HashObject {
        /**
         * 创建一个 Matrix 对象
         * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
         * @param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
         * @param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
         * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
         * @param tx 沿 x 轴平移每个点的距离。
         * @param ty 沿 y 轴平移每个点的距离。
         */
        constructor(a:number = 1, b:number = 0, c:number = 0, d:number = 1, tx:number = 0, ty:number = 0) {
            super();
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        /**
         * 缩放或旋转图像时影响像素沿 x 轴定位的值
         */
        public a:number;
        /**
         * 旋转或倾斜图像时影响像素沿 y 轴定位的值
         */
        public b:number;
        /**
         * 旋转或倾斜图像时影响像素沿 x 轴定位的值
         */
        public c:number;
        /**
         * 缩放或旋转图像时影响像素沿 y 轴定位的值
         */
        public d:number;
        /**
         * 沿 x 轴平移每个点的距离
         */
        public tx:number;
        /**
         * 沿 y 轴平移每个点的距离
         */
        public ty:number;

        /**
         * 返回一个新的 Matrix 对象，它是此矩阵的克隆，带有与所含对象完全相同的副本。
         */
        public clone(): Matrix {
            return new Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
        }

        /**
         * 将某个矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。
         * @param other 要连接到源矩阵的矩阵。
         */
        public concat(other: Matrix): void {
            var a0 =  this.a;
            var b0 =  this.b;
            var c0 =  this.c;
            var d0 =  this.d;
            var tx0 = this.tx;
            var ty0 = this.ty;

            var a1 =  other.a;
            var b1 =  other.b;
            var c1 =  other.c;
            var d1 =  other.d;
            var tx1 = other.tx;
            var ty1 = other.ty;

            var a =  a0 * a1;
            var b =  0.0;
            var c =  0.0;
            var d =  d0 * d1;
            var tx = tx0 * a1 + tx1;
            var ty = ty0 * d1 + ty1;

            if (b0 !== 0.0 || c0 !== 0.0 || b1 !== 0.0 || c1 !== 0.0) {
                a  += b0 * c1;
                d  += c0 * b1;
                b  += a0 * b1 + b0 * d1;
                c  += c0 * a1 + d0 * c1;
                tx += ty0 * c1;
                ty += tx0 * b1;
            }

            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        /**
         * 将源 Matrix 对象中的所有矩阵数据复制到调用方 Matrix 对象中。
         */
        public copyFrom(other: Matrix): void {
            this.a = other.a;
            this.b = other.b;
            this.c = other.c;
            this.d = other.d;
            this.tx = other.tx;
            this.ty = other.ty;
        }

        /**
         * 包括用于缩放、旋转和转换的参数。当应用于矩阵时，该方法会基于这些参数设置矩阵的值。
         * 通过使用 createBox() 方法，您可以获得与依次应用 identity()、rotate()、scale() 和 translate() 方法时得到的矩阵相同的矩阵。
         * @param scaleX 水平缩放所用的系数。
         * @param scaleY 垂直缩放所用的系数。
         * @param rotation 旋转量（以弧度为单位）。
         * @param tx 沿 x 轴向右平移（移动）的像素数。
         * @param ty 沿 y 轴向下平移（移动）的像素数。
         */
        public createBox(scaleX: number, scaleY: number, rotation: number = 0, tx: number = 0, ty: number = 0): void {
            if (rotation !== 0) {
                var u = cos(rotation);
                var v = sin(rotation);
                this.a =  u * scaleX;
                this.b =  v * scaleY;
                this.c = -v * scaleX;
                this.d =  u * scaleY;
            }
            else {
                this.a = scaleX;
                this.b = 0;
                this.c = 0;
                this.d = scaleY;
            }
            this.tx = tx;
            this.ty = ty;
        }

        /**
         * 创建 Graphics 类的 beginGradientFill() 和 lineGradientStyle() 方法所需的矩阵的特定样式。
         * 宽度和高度被缩放为 scaleX/scaleY 对，而 tx/ty 值偏移了宽度和高度的一半。
         * @param width 渐变框的宽度。
         * @param height 渐变框的高度。
         * @param rotation 旋转量（以弧度为单位）。
         * @param tx 沿 x 轴向右平移的距离（以像素为单位）。此值将偏移 width 参数的一半。
         * @param ty 沿 y 轴向下平移的距离（以像素为单位）。此值将偏移 height 参数的一半。
         */
        public createGradientBox(width: number, height: number, rotation: number = 0, tx: number = 0, ty: number = 0): void {
            this.createBox(width / 1638.4, height / 1638.4, rotation, tx + width / 2, ty + height / 2);
        }

        /**
         * 如果给定预转换坐标空间中的点，则此方法返回发生转换后该点的坐标。
         * 与使用 transformPoint() 方法应用的标准转换不同，deltaTransformPoint() 方法的转换不考虑转换参数 tx 和 ty。
         * @param pointX 想要获得其矩阵转换结果的点的x坐标。
         * @param pointY 想要获得其矩阵转换结果的点的y坐标。
         * @param resultPoint 我们建议尽可能减少创建对象次数来优化性能，可以从外部传入一个复用的Point对象来存储结果，若不传入将创建一个新的Point对象返回。
         * @returns 由应用矩阵转换所产生的点。
         */
        public deltaTransformPoint(pointX:number,pointY:number,resultPoint?:Point): Point {
            var x = this.a * pointX + this.c * pointY;
            var y = this.b * pointX + this.d * pointY;
            if(resultPoint){
                resultPoint.setTo(x,y);
                return resultPoint;
            }
            return new Point(x, y);
        }

        /**
         * 为每个矩阵属性设置一个值，该值将导致矩阵无转换。通过应用恒等矩阵转换的对象将与原始对象完全相同。
         * 调用 identity() 方法后，生成的矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0 和 ty=0。
         */
        public identity(): void {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
        }

        /**
         * 执行原始矩阵的逆转换。
         * 您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
         */
        public invert():void {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            var tx1 = this.tx;
            var ty1 = this.ty;
            var n = a1 * d1 - b1 * c1;

            this.a = d1 / n;
            this.b = -b1 / n;
            this.c = -c1 / n;
            this.d = a1 / n;
            this.tx = (c1 * ty1 - d1 * tx1) / n;
            this.ty = -(a1 * ty1 - b1 * tx1) / n;
        }

        /**
         * 对 Matrix 对象应用旋转转换。
         * rotate() 方法将更改 Matrix 对象的 a、b、c 和 d 属性。
         * @param angle 以弧度为单位的旋转角度。
         */
        public rotate(angle: number): void {
            angle = +angle;
            if (angle !== 0) {
                var u = cos(angle);
                var v = sin(angle);
                var ta = this.a;
                var tb = this.b;
                var tc = this.c;
                var td = this.d;
                var ttx = this.tx;
                var tty = this.ty;
                this.a = ta  * u - tb  * v;
                this.b = ta  * v + tb  * u;
                this.c = tc  * u - td  * v;
                this.d = tc  * v + td  * u;
                this.tx = ttx * u - tty * v;
                this.ty = ttx * v + tty * u;
            }
        }

        /**
         * 对矩阵应用缩放转换。x 轴乘以 sx，y 轴乘以 sy。
         * scale() 方法将更改 Matrix 对象的 a 和 d 属性。
         * @param sx 用于沿 x 轴缩放对象的乘数。
         * @param sy 用于沿 y 轴缩放对象的乘数。
         */
        public scale(sx: number, sy: number): void {
            if (sx !== 1) {
                this.a *= sx;
                this.c *= sx;
                this.tx *= sx;
            }
            if (sy !== 1) {
                this.b *= sy;
                this.d *= sy;
                this.ty *= sy;
            }
        }

        /**
         * 将 Matrix 的成员设置为指定值
         * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
         * @param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
         * @param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
         * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
         * @param tx 沿 x 轴平移每个点的距离。
         * @param ty 沿 y 轴平移每个点的距离。
         */
        public setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        /**
         * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
         * @param pointX 想要获得其矩阵转换结果的点的x坐标。
         * @param pointY 想要获得其矩阵转换结果的点的y坐标。
         * @param resultPoint 我们建议尽可能减少创建对象次数来优化性能，可以从外部传入一个复用的Point对象来存储结果，若不传入将创建一个新的Point对象返回。
         * @returns 由应用矩阵转换所产生的点。
         */
        public transformPoint(pointX:number,pointY:number,resultPoint?:Point): Point {

            var x = this.a * pointX + this.c * pointY + this.tx;
            var y = this.b * pointX + this.d * pointY + this.ty;
            if(resultPoint){
                resultPoint.setTo(x,y);
                return resultPoint;
            }
            return new Point(x, y);
        }

        /**
         * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
         * @param dx 沿 x 轴向右移动的量（以像素为单位）。
         * @param dy 沿 y 轴向下移动的量（以像素为单位）。
         */
        public translate(dx: number, dy: number): void {
            this.tx += dx;
            this.ty += dy;
        }
    }

    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;

    function cos(angle: number): number {
        switch (angle) {
            case HalfPI: case -PacPI: return 0;
            case PI: case -PI: return -1;
            case PacPI: case -HalfPI: return 0;
            default:
                return Math.cos(angle);
        }
    }

    function sin(angle: number): number {
        switch (angle) {
            case HalfPI: case -PacPI: return 1;
            case PI: case -PI: return 0;
            case PacPI: case -HalfPI: return -1;
            default:
                return Math.sin(angle);
        }
    }
}