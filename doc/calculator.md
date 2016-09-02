# calculator

计算器提供了多种计算的通用方法，考虑到javascript使用浮点运算进行计算的精度问题，会出现0.1+0.2 = 0.30000000000000004
的极端问题，计算器接口屏蔽了这些影响，在除除法以外的计算中都确保计算精度，同时除法也确保相对精确。

计算器封装在S3.cal对象内，共包含12个方法

## cal
1. [四则运算](#1)
2. [金额处理](#2)
3. [数组运算](#3)
4. [使用样例](#4)

## 1.四则运算
```javascript
S3.cal.add(a,b)  //a+b  确保精度
S3.cal.sub(a,b)  //a-b  确保精度
S3.cal.mul(a,b)  //a*b   确保精度
S3.cal.div(a,b)  //a/b   相对精确
```
## 2.金额处理
```javascript
S3.cal.addComma(n) //增加金额的逗号 addComma(a) //1000--->1,000
S3.cal.removeComma(n)  //移除逗号 removeComma(a) //1,000--->1000
```
## 3.数组运算
```javascript
S3.cal.arrMul(a,b)      //a[0]*b[0] a[1]*b[1] ... 返回一个新数组
S3.cal.addArr(a,b)      //a[0]+b[0] a[1]+b[1] ... 返回一个新数组
S3.cal.subArr(a,b)      //a[0]-b[0] a[1]-[1] ... 返回一个新数组
S3.cal.arrAddNum(a,n)    //a[i]+n ---b[i]  对每一项加上同一个数
S3.cal.arrSubNum(a,n)    //a[i]-n ---b[i]   对每一项减去同一个数
S3.cal.arrMulNum(a,n)    //a[i]*n ---b[i]   对每一项乘以同一个数
```

## 4.使用样例
例子：
```javascript
var a = 0.2;
var b = 0.3;
S3.cal.add(0.2,0.3)  //return 0.5
var c = [0.1,1];
S3.cal.arrAddNum(c,a)  //return [0.3,1.2]
```