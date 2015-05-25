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


module lark.gui {

	/**
	 * UI事件
	 */
	export class UIEvent extends Event{

		public constructor(type:string, bubbles?:boolean, cancelable?:boolean){
			super(type, bubbles, cancelable);
		}

		/**
		 * 改变结束
		 */
		public static CHANGE_END:string = "changeEnd";
		
		/**
		 * 值发生改变
		 */
		public static VALUE_COMMIT:string = "valueCommit";
		/**
		 * 容器的内容尺寸发生改变
		 */
		public static CONTENT_SIZE_CHANGED:string = "contentSizeChanged";
		/**
		 * 容器的滚动位置发生改变
		 */
		public static SCROLL_POSITION_CHANGED:string = "scrollPositionChanged";
		/**
		 * 即将关闭面板事件
		 */
		public static CLOSING:string = "close";

		/**
		 * 使用指定的EventEmitter对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
		 * @param target 事件派发目标
		 * @param eventType 事件类型
		 */
		public static emitUIEvent(target:IEventEmitter, eventType:string):boolean {
            if(!target.hasListener(eventType)){
                return true;
            }
			var event = Event.create(UIEvent, eventType);
			var result = target.emit(event);
			Event.release(event);
			return result;
		}
	}
	registerClass(UIEvent,Types.UIEvent);
}