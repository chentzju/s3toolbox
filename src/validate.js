/**
 * Created by zjfh-chent on 2016/8/24.
 */
+function(toolbox){
    /**
     * 验证函数对象
     * @param form
     * @param options
     *
     * example:
     *  options = {
     *       onsuccess:function(){},  //验证通过后的回调函数
     *       submitButton:button,   //如果form不是表单，button不会自动提交，因此需要指定这个被点击后触发校验的按钮
     *       patterns:{} //如果对当前的type='number'或者mobilephone或者email不满意，可以自己写pattern 一般用不到
     *       markValid:function(validity){}    //如果对目前的校验成功的效果不满意，可以重新定义
     *       markInValid:function(validity){}  //如果对目前的校验失败变红不满意，可以重新定义
     *  }
     */
    var Validator = function(form,options){
        this.options = $.extend({}, Validator.DEFAULTS, options);
        this.options.patterns = $.extend({}, Validator.DEFAULTS.patterns, options.patterns);
        this.$element = $(form);
        this.init();
    };

    //默认配置
    Validator.DEFAULTS = {
        inputType: ['email', 'number', 'mobilephone'],
        patterns: {},
        validateOnSubmit: true,
        allFields: ':input:not(:submit, :button, :disabled, :hidden)',
        inValidClass: 'validate-field-error',
        validClass: 'validate-field-success',
        keyboardFields: ':input:not(:button, :disabled, :hidden)',
        keyboardEvents: 'focusout, keyup',
        submitButton:null,
        onValid: function (validity) {
        },
        onInValid: function (validity) {
        },
        markValid: function (validity) {
            var options = this.options;
            var $field = $(validity.field);
            $field.addClass(options.validClass).removeClass(options.inValidClass);
            $field.parent().find('.validate-alert').hide();
            options.onValid.call(this, validity);
        },
        markInValid: function (validity) {
            var options = this.options;
            var $field = $(validity.field);
            $field.addClass(options.inValidClass).removeClass(options.validClass);
            var $alert = $field.parent().find('.validate-alert');
            if (!$alert.length) {
                $alert = $("<div class='validate-alert'></div>").hide();
                $field.after($alert);
            }
            $alert.html(validity.errormsg).show();
            options.onInValid.call(this, validity);
        },
        onsuccess:function(){}
    };
    Validator.DEFAULTS.patterns = {
        email: /^((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/,
        number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
        dateISO: /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
        integer: /^-?\d+$/,
        mobilephone:"^(86)?1[3,5,7,8]\\d{9}$"
        //TODO password pattern 理论上也应该加上
    };
    Validator.ERROR_MAP = {
        tooShort: 'minlength',
        checkedOverflow: 'maxchecked',
        checkedUnderflow: 'minchecked',
        rangeOverflow: 'max',
        rangeUnderflow: 'min',
        tooLong: 'maxlength'
    };
    Validator.validationMessages = {
        valueMissing: '必须填写这个字段',
        tooShort: '至少填写 %s 个字符',
        patternMismatch: '请按照要求的格式填写',
        rangeOverflow: '请填写小于等于 %s 的值',
        rangeUnderflow: '请填写大于等于 %s 的值',
        stepMismatch: '',
        tooLong: '至多填写 %s 个字符',
        typeMismatch: '请按照规定的类型填写'
    };

    /**
     * 初始化
     */
    Validator.prototype.init = function() {
        var _this = this;
        var $element = this.$element;
        var options = this.options;

        //禁用HTML5原生的校验器
        $element.attr('novalidate', 'novalidate');
        function regexToPattern(regex) {
            var pattern = regex.toString();
            return pattern.substring(1, pattern.length - 1);
        }
        //对于H5原生校验禁用的，补充一个pattern，来确保原生校验关闭后，仍能校验
        $.each(options.inputType, function(i, type) {
            var $field = $element.find('input[type=' + type + ']');
            if(type == 'mobilephone'){
                $field.attr('type','number');
            }
            if (!$field.attr('pattern')) {
                $field.attr('pattern', regexToPattern(options.patterns[type]));
            }
        });

        //当提交的时候调用
        $element.on('submit.validator', function(e) {
            //如果没有validateOnSubmit，点击提交的时候不会校验，通过option配置
            if (options.validateOnSubmit) {
                var formValidity = _this.isFormValid();
                //return result
                if ($.type(formValidity) === 'boolean') {
                    if(formValidity && typeof options.onsuccess == 'function')
                        options.onsuccess();
                    return formValidity;
                }
            }
        });

        //当表单不是<form>标签时，定义一个提交的按钮，点击这个按钮的时候调用
        if(options.submitButton){
            $(options.submitButton).on('click.validator', function(e) {
                //如果没有validateOnSubmit，点击提交的时候不会校验，通过option配置
                if (options.validateOnSubmit) {
                    var formValidity = _this.isFormValid();
                    //return result
                    if ($.type(formValidity) === 'boolean') {
                        if(formValidity && typeof options.onsuccess == 'function')
                            //表单校验成功，则调用成功后的函数
                            options.onsuccess();
                        return formValidity;
                    }
                }
            });
        }

        //绑定时间的函数
        function bindEvents(fields, eventFlags) {
            var events = eventFlags.split(',');
            var validate = function(e) {
                _this.validate(this);
            };
            $.each(events, function(i, event) {
                $element.on(event + '.validator', fields, validate);
            });
        }

        //绑定事件
        bindEvents(options.keyboardFields, options.keyboardEvents);
    };

    /**
     *
     * @param field
     * @returns {*}
     */
    Validator.prototype.validate = function(field) {
        var _this = this;
        var $element = this.$element;
        var $field = $(field);

        // 验证确认密码
        var equalTo = $field.attr('equalTo');
        //本质上就是把前一个密码的正则用到后一个的pattern字段
        if (equalTo) {
            $field.attr('pattern', '^' + $element.find(equalTo).val() + '$');
        }

        var pattern = $field.attr('pattern') || false;
        var re = new RegExp(pattern);
        var value = $field.val();

        //确定校验
        var required = ($field.attr('required') !== undefined) && ($field.attr('required') !== 'false');
        var maxLength = parseInt($field.attr('maxlength'), 10);
        var minLength = parseInt($field.attr('minlength'), 10);
        var min = Number($field.attr('min'));
        var max = Number($field.attr('max'));

        //取得校验结果
        var validity = this.createValidity({field: $field[0], valid: true});

        //验证长度
        if (!isNaN(maxLength) && value.length > maxLength) {
            validity.valid = false;
            validity.tooLong = true;
        }
        if (!isNaN(minLength) && value.length < minLength) {
            validity.valid = false;
            validity.tooShort = true;
        }

        // TODO: 日期验证
        //最大值和最小值验证
        if (!isNaN(min) && Number(value) < min) {
            validity.valid = false;
            validity.rangeUnderflow = true;
        }
        if (!isNaN(max) && Number(value) > max) {
            validity.valid = false;
            validity.rangeOverflow = true;
        }
        //是否必须验证
        if (required && !value) {
            validity.valid = false;
            validity.valueMissing = true;
        }else if (pattern && !re.test(value) && value){ // check pattern
            validity.valid = false;
            validity.patternMismatch = true;
        }

        //校验完成，调用完成的函数
        var validateComplete = function(validity) {
            validity.errormsg = _this.getValidationMessage(validity);
            _this.markField(validity);
            $field.data('validity', validity);
            return validity;
        };
        validateComplete(validity);
    };
    /**
     * 创建校验结果对象
     * @param validity
     */
    Validator.prototype.createValidity = function(validity) {
        return $.extend({
            tooShort: validity.tooShort || false,
            patternMismatch: validity.patternMismatch || false,
            rangeOverflow: validity.rangeOverflow || false, // higher than maximum
            rangeUnderflow: validity.rangeUnderflow || false, // lower than  minimum
            valueMissing: validity.valueMissing || false,
            stepMismatch: validity.stepMismatch || false,
            tooLong: validity.tooLong || false,
            typeMismatch: validity.typeMismatch || false,
            valid: validity.valid || true
        }, validity);
    };

    /**
     * 校验结果显示，调用options中的函数，可以自定义
     * @param validity
     */
    Validator.prototype.markField = function(validity) {
        var options = this.options;
        var flag = 'mark' + (validity.valid ? '' : 'In') + 'Valid';
        options[flag] && options[flag].call(this, validity);
    };

    /**
     * 获取校验错误声明
     * @param validity
     * @returns {*|undefined}
     */
    Validator.prototype.getValidationMessage = function(validity) {
        var messages = Validator.validationMessages;
        var error;
        var message;
        var placeholder = '%s';
        var $field = $(validity.field);

        // get error name
        $.each(validity, function(key, val) {
            // skip `field` and `valid`
            if (key === 'field' || key === 'valid') {
                return key;
            }
            // W3C specs error type
            if (val === true) {
                error = key;
                return false;
            }
        });

        message = messages[error] || undefined;

        if (message && Validator.ERROR_MAP[error]) {
            message = message.replace(placeholder,
                $field.attr(Validator.ERROR_MAP[error]) || '规定的');
        }
        return message;
    };

    /**
     *
     * @returns {*}
     */
    Validator.prototype.isFormValid = function() {
        var formValidity = this.validateForm();
        if (!formValidity.valid) {
            return false;
        }
        return true;
    };

    /**
     *
     * @returns {{valid: boolean, validity: Array}}
     */
    Validator.prototype.validateForm = function() {
        var _this = this;
        var $element = this.$element;
        var options = this.options;
        var $allFields = $element.find(options.allFields);
        var valid = true;
        var formValidity = [];
        $allFields.each(function() {
            var $this = $(this);
            var fieldValid = _this.isValid(this);
            var fieldValidity = $this.data('validity');
            valid = !!fieldValid && valid;
            formValidity.push(fieldValidity);
        });

        var validity = {
            valid: valid,
            validity: formValidity
        };
        return validity;
    };
    /**
     *
     * @param field
     * @returns {boolean}
     */
    Validator.prototype.isValid = function(field) {
        var $field = $(field);
        //如果没有认证过，就要认证一次，认证过的不需要再次认证
        if ($field.data('validity') === undefined) {
            this.validate(field);
        }
        return $field.data('validity') && $field.data('validity').valid;
    };
    //定义接口
    toolbox.validate = function(form,option){
        return new Validator(form,option);
    };
}(S3);