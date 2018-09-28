# v1.1.3
- [fixed] 修复了serverDate传入参数时的bug

# v1.1.3
- [fixed] 修复了数据库读取serverDate结构的问题

# v1.1.2
- [fixed] 修复了数据库set的多维对象的操作问题

# v1.1.0
- [changed] 支持使用多个环境


# v1.0.31

- [changed] 云函数调用返回的requestId可以在云控制台用来查看日志
- [changed] 数据库地理位置初始化时第一个参数为longitude，第二个为latitude
- [add] 新增条件删除文档接口

# v1.0.29

- [changed] 更新文档

# v1.0.24

- [changed] 获取文件下载链接方法参数变更，详情见对应api文档

# v1.0.23

- [fixed] 修复了新增内嵌文档的bug

# v1.0.22

- [fixed] update和set传空参数会报错，不再抛出异常
- [fixed] init可以传空
- [changed] 云函数的调用，云函数实际返回的结果从字符串改成了对象，也就是透传云函数返回的结果

# v1.0.21

- [fixed] update内嵌文档的操作符使用

# v1.0.20

- [changed] 修改了集合创建的方法
- [fixed] 修正了环境id的传入bug

# v1.0.19

- [changed] 增加了新增集合方法
- [changed] 增加了文件下载方法

# v1.0.18

- [changed] 数据库操作的field()方法后需要get()才能取得数据
- [changed] 添加了数据库的serverDate数据类型
- [changed] 增加了数据库的更新(update)方法的数组操作符push、pop、shift和unshift，增加了set指令
- [changed] 数据库逻辑运算符and和or支持传入一个数字，作为逻辑运算的参数


# v1.0.17

- [changed] 对象初始化实例后，init操作可以传入空参数，这样会使用默认环境。如果需要指定环境(env)或者代理(proxy)，则还是通过init方法传入。
- [changed] init时跟小程序SDK保持参数命名一致，envName改为env
- [changed] init时mpAppId不再需要传入
- [changed] 修复了数据库排序的bug
- [changed] 增加了数据库的count方法
- [changed] 修正了文档，修改了文件存储和云函数的返回结果。请参考文档

# v1.0.9

- [changed] 云函数内使用不需要填写secretId和secretKey，云函数重新部署后生效
- [changed] 文件上传添加支持buffer
- [changed] 修复了嵌套对象的bug
