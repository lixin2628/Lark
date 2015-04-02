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
     * 纹理绘制器实例
     */
    export var $textureDrawer:lark.player.ITextureDrawer;
    /**
     * 纹理类是对不同平台不同的图片资源的封装
     * 在HTML5中，资源是一个HTMLElement对象
     * 在OpenGL / WebGL中，资源是一个提交GPU后获取的纹理id
     * Texture类封装了这些底层实现的细节，开发者只需要关心接口即可
     */
    export class Texture extends HashObject {

        /**
         * 创建一个 lark.Texture 对象
         */
        public constructor() {
            super();
        }

        /**
         * 表示这个纹理在 bitmapData 上的 x 起始位置
         */
        $bitmapX:number = 0;
        /**
         * 表示这个纹理在 bitmapData 上的 y 起始位置
         */
        $bitmapY:number = 0;
        /**
         * 表示这个纹理在 bitmapData 上的宽度
         */
        $bitmapWidth:number = 0;
        /**
         * 表示这个纹理在 bitmapData 上的高度
         */
        $bitmapHeight:number = 0;

        /**
         * 表示这个纹理显示了之后在 x 方向的渲染偏移量
         */
        $offsetX = 0;
        /**
         * 表示这个纹理显示了之后在 y 方向的渲染偏移量
         */
        $offsetY = 0;


        $width:number = 0;
        /**
         * 纹理宽度
         */
        public get width():number {
            return this.$width;
        }


        $height:number = 0;
        /**
         * 纹理高度
         */
        public get height():number {
            return this.$height;
        }

        /**
         * 表示bitmapData.width
         */
        $sourceWidth:number = 0;
        /**
         * 表示bitmapData.height
         */
        $sourceHeight:number = 0;

        $bitmapData:any = null;

        $setBitmapData(value:any) {
            var w = +value.width | 0;
            var h = +value.height | 0;
            this.$bitmapData = value;
            this.$width = this.$bitmapWidth = this.$sourceWidth = w;
            this.$height = this.$bitmapHeight = this.$sourceHeight = h;
            this.$offsetX = this.$offsetY = this.$bitmapX = this.$bitmapY = 0;
        }

        /**
         * 将显示对象或另一个Texture的图像数据绘制到自身。
         * @param source 要绘制到 Texture 对象的显示对象或 Texture 对象。
         * @param matrix 一个 Matrix 对象，用于缩放、旋转位图或转换位图的坐标。如果不想将矩阵转换应用于图像，
         * 请将此参数设置为恒等矩阵（使用默认 new Matrix() 构造函数创建），或传递 null 值。
         * @param alpha 要叠加的透明度值。如果没有提供任何值，则不会转换位图图像的透明度。如果必须传递此参数但又不想转换图像，请传递值 1。
         * @param clipRect 一个 Rectangle 对象，定义要绘制的源对象的区域。 如果不提供此值，则不会进行剪裁，并且将绘制整个源对象。
         */
        public draw(source:DisplayObject|Texture,matrix?:Matrix,alpha?:number,clipRect?:Rectangle):void{
            if(source instanceof DisplayObject){
                $textureDrawer.drawDisplayObject(this,source,matrix,alpha,clipRect);
            }
        }
    }
}