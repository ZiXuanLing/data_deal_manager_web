const app = new Vue({
    el: '#app',
    data() {
        // 检验学号是否存在，什么时候触发这个校验？
        const rulesSNo = (rules, value, callback) => {
            if (this.isEdit) {
                callback()  // 更新数据时遇到的sno校验
            }
            axios.post(
                this.baseURL + 'sno/check', {
                sno: value
            }
            )
                .then((res) => {
                    if (res.data.code == 1) {
                        if (res.data.exists) {
                            callback(new Error("学号已存在"))
                        }
                        else {
                            callback()
                        }
                    }
                    else {
                        callback(new Error("后端出现异常"))
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        return {
            msg: 'Hello, Vue!',
            baseURL: 'http://127.0.0.1:8000/',
            students: [],   // 所有的学生信息
            pageStudents: [],   // 分页后当前页的学生
            total: 0,
            currentpage: 1, // 当前所在的页
            pagesize: 5,// 每页显示多少行
            inputStr: '',    // 输入的查询条件
            dialogVisible: false,       // 弹出框是否弹出
                        
            selectStudent: [],

            studentForm: {
                sno: '',
                name: '',
                gender: '',
                birthday: '',
                mobile: '',
                email: '',
                address: '',
                image: '',
                imageUrl: '',
            },

            dialogTitle: '',
            isView: false,
            isEdit: false,
            rules: {    // 表单规范校验
                sno: [
                    { required: true, massage: '学号不能为空', trigger: 'blur' },
                    {
                        pattern: /^[9][5]\d{3}$/, message: '学号必须是95开头的五位数',
                        trigger: 'blur'
                    },
                    { validator: rulesSNo, trigger: 'blur' } // 失去焦点的时候触发rulesSNo函数
                ],
                name: [
                    { required: true, massage: '姓名不能为空', trigger: 'blur' },
                    {
                        pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '姓名必须是2-5个汉字',
                        trigger: 'blur'
                    }
                ],
                gender: [
                    { required: true, massage: '性别不能为空', trigger: 'change' },
                ],
                birthday: [
                    { required: true, massage: '出生日期不能为空', trigger: 'change' },
                ],
                mobile: [
                    { required: true, massage: '手机号码不能为空', trigger: 'blur' },
                    {
                        pattern: /^[1][35798]\d{9}$/, message: '手机号码必须符合规范',
                        trigger: 'blur'
                    }
                ],
                email: [
                    { required: true, massage: '邮箱地址不能为空', trigger: 'blur' },
                ],
                address: [
                    { required: true, massage: '家庭地址不能为空', trigger: 'blur' },
                ]
            }
        }
    },
    mounted() { // 自动加载数据
        this.getStudents()
    },
    methods: {
        // 得到所有学生的信息
        getStudents: function () {
            // 记录this地址
            let that = this
            axios   // 此时this会指向undefined
                .get(that.baseURL + 'students/')
                .then(function (res) {
                    if (res.data.code == 1) {
                        that.students = res.data.data
                        // 获取总行数
                        that.total = res.data.data.length
                        // 获取当前页的数据
                        that.getPageStudents()
                        that.$message({
                            message: '数据加载成功',
                            type: 'success'
                        })
                    }
                    else {
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        },
        // 获取当前页的学生数据
        getPageStudents: function () {
            // 清空pageStudents
            this.pageStudents = []
            // 获得当前页的数据
            for (let i = (this.currentpage - 1) * this.pagesize; i < this.total; i++) {
                this.pageStudents.push(this.students[i])
                // 判断是否大的一页的要求
                if (this.pageStudents.length == this.pagesize) {
                    break
                }
            }
        },
        // 分页时修改每页的行数
        handleSizeChange: function (size) {
            this.pagesize = size
            this.getPageStudents()
        },
        // 调整当前页码
        handleCurrentChange: function (pageNumber) {
            this.currentpage = pageNumber
            this.getPageStudents()
        },
        // 查询
        queryStudents() {
            // 使用ajax请求-post-传递inputStr
            let that = this
            axios
                .post(
                    that.baseURL + 'students/query', {  // 大括号里面传递的是post请求
                    'input_str': that.inputStr
                }
                )
                .then(function (res) {
                    if (res.data.code == 1) {
                        that.students = res.data.data
                        // 获取总行数
                        that.total = res.data.data.length
                        // 获取当前页的数据
                        that.getPageStudents()
                        that.$message({
                            message: '查询数据加载成功',
                            type: 'success'
                        })
                    }
                    else {
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(function (err) {
                    that.$message.error("获取后端查询结果失败");
                })
        },
        // 全部按钮
        getAllStudents() {
            this.inputStr = ''
            this.getStudents()
        },
        // 更改弹出框文字
        addStudent() {
            this.dialogVisible = true
            this.dialogTitle = "添加学生明细"
        },
        // 关闭弹出框的表单
        closeDialogForm(formName) {
            // 重置表单的校验
            this.$refs[formName].resetFields()

            this.studentForm.sno = ''
            this.studentForm.name = ''
            this.studentForm.gender = ''
            this.studentForm.birthday = ''
            this.studentForm.mobile = ''
            this.studentForm.email = ''
            this.studentForm.address = ''
            this.studentForm.image = ''
            this.studentForm.imageUrl = ''

            this.dialogVisible = false

            this.isView = false
            this.isEdit = false
        },
        // 根据id获取image
        getImageById(sno) {
            // 遍历
            for (oneStudent of this.students) {
                if (oneStudent.sno == sno) {
                    return oneStudent.image
                }
            }
        },
        // 查看学生的明细
        viewStudent(row) {
            // 弹出表单
            this.dialogVisible = true
            this.dialogTitle   = '查看学生明细'
            this.isView        = true
            // 进行浅拷贝
            this.studentForm = JSON.parse(JSON.stringify(row))
            // 获取照片
            this.studentForm.image = this.getImageById(row.sno)
            // 获取照片的url
            this.studentForm.imageUrl = this.baseURL + 'media/' + this.studentForm.image
        },
        // 修改学生的明细
        updateStudent(row) {
            // 弹出表单
            this.dialogVisible = true
            this.dialogTitle   = '修改学生明细'
            this.isEdit        = true
            this.studentForm   = JSON.parse(JSON.stringify(row))
            // 获取照片
            this.studentForm.image = this.getImageById(row.sno)
            // 获取照片的url
            this.studentForm.imageUrl = this.baseURL + 'media/' + this.studentForm.image
        },
        // 表单校验
        submitStudentForm(formName) {
            // 这一步是为了防止更新数据的时候sno为int的情况，且对于字符型字符化不会改变其类型
            this.studentForm['sno'] = this.studentForm['sno'].toString(10)

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 校验成功后，执行添加或者修改
                    if (this.isEdit) {
                        // 表明这个是修改操作
                        this.submitUpdateStudent()
                    }
                    else {
                        // 表明这个是添加操作
                        this.submitAddStudent()
                    }
                }
                else {
                    console.log('error submit!')
                    return false
                }
            })
        },
        // 添加到数据库
        submitAddStudent() {
            let that = this
            axios
                .post(that.baseURL + 'student/add', that.studentForm)
                .then(res => {
                    if (res.data.code == 1) {
                        that.students = res.data.data   // 获取所有学生的信息
                        that.total = res.data.data.length   // 获取记录条数
                        that.getPageStudents()  // 获取分页信息

                        that.$message({
                            message: '添加数据成功',
                            type: 'success',
                        })
                        // 关闭窗体
                        that.closeDialogForm('studentForm')
                    }
                    else {
                        that.$message.error(res.data.msg)
                    }
                })
                .catch(err => {
                    console.log(err)
                    that.$message.error('error!')
                })
        },
        // 修改更新到数据库
        submitUpdateStudent() {
            let that = this
            axios
                .post(that.baseURL + 'student/update', that.studentForm)
                .then(res => {
                    if (res.data.code == 1) {
                        that.students = res.data.data   // 获取所有学生的信息
                        that.total = res.data.data.length   // 获取记录条数
                        that.getPageStudents()  // 获取分页信息

                        that.$message({
                            message: '修改数据成功',
                            type: 'success',
                        })
                        // 关闭窗体
                        that.closeDialogForm('studentForm')
                    }
                    else {
                        that.$message.error(res.data.msg)
                    }
                })
                .catch(err => {
                    console.log(err)
                    that.$message.error('error!')
                })
        },
        // 删除学生信息
        deleteStudent(row) {
            this.$confirm('是否确认删除学生信息[学号：' + row.sno + '\t姓名：' + row.name + ']?',
                '提示', {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let that = this
                axios
                    .post(that.baseURL + 'student/delete', {
                        sno: row.sno
                    })
                    .then(res => {
                        if (res.data.code == 1) {
                            that.students = res.data.data
                            that.total = res.data.data.length
                            // 分页
                            that.getPageStudents()

                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        else {
                            that.$message.error(res.data.msg)
                        }
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 选择复选框时的操作
        handleSelectionChange(data) {
            this.selectStudent = data
        },
        // 批量删除信息
        deleteStudents() {
            this.$confirm('是否确认批量删除' + this.selectStudent.length + '个学生信息?',
                '提示', {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let that = this
                axios
                    .post(that.baseURL + 'students/delete', {
                        students: that.selectStudent,
                    })
                    .then(res => {
                        if (res.data.code == 1) {
                            that.students = res.data.data
                            that.total = res.data.data.length
                            // 分页
                            that.getPageStudents()

                            this.$message({
                                type: 'success',
                                message: '数据批量删除成功!'
                            });
                        }
                        else {
                            that.$message.error(res.data.msg)
                        }
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });            
        },
        // 上传照片时触发
        uploadPicturePost(file) {
            // 定义that,防止后期this隐式的变为当前对象
            let that = this
            // 定义一个formdata类
            let fileReq = new FormData()
            // 把照片传入
            fileReq.append('avatar', file.file)
            // 使用axios
            axios({
                method: 'post',
                url: that.baseURL + 'upload/',
                data: fileReq,
            })
            .then(res => {
                if (res.data.code == 1) {
                    // 把照片给image
                    that.studentForm.image = res.data.name
                    // 拼接imageurl
                    that.studentForm.imageUrl = that.baseURL + 'media/' + res.data.name
                }
                else {
                    that.$message.error(res.data.msg)
                }
            })
            .catch(err => {
                // 执行失败
                console.log(err)
                that.$message.error(err)
            })
        },
        // 导入excel
        uploadExcelPost(file) {
            let that = this
            // 实例化一个formdata
            let fileReq = new FormData()
            // 把照片传入
            fileReq.append('excel', file.file)
            axios({
                method: 'post',
                url: that.baseURL + 'excel/import',
                data: fileReq,
            })
            .then(res => {
                if (res.data.code == 1) {
                    // 把照片给image
                    that.students = res.data.data
                    // 计算总共多少条
                    that.total = res.data.data.length
                    // 分页
                    that.getPageStudents()
                    // 弹出框显示结果
                    this.$alert('本地导入成功：' + res.data.success + 
                                '\n失败：' + res.data.error, '导入结果展示', {
                        confirmButtonText: '确定',
                        callback: action => {
                          this.$message({
                            type: 'info',
                            message: '本次导入失败数量为：' + res.data.success + '具体的学号为：' +
                                res.data.errors,
                            });
                        },
                    })
                    // 失败明细打印
                    console.log('本次导入失败数量为：' + res.data.success + '具体的学号为：');
                    console.log(res.data.errors)
                }
                else {
                    that.$message.error(res.data.msg)
                }
            })
            .catch(err => {
                // 执行失败
                console.log(err)
                that.$message.error('上传excel出现异常')
            })
        },
        // 导出excel
        exportToExcel() {
            let that = this
            axios.get(that.baseURL + 'excel/export/')
            .then(res => {
                if (res.data.code == 1) {
                    // 拼接url
                    let url = that.baseURL + 'media/' + res.data.name
                    // 下载
                    window.open(url)
                }
                else {
                    that.$message.error('到处excel出现异常')
                }
            })
            .catch(err => {
                console.log(err)
            })
        },
    },
})