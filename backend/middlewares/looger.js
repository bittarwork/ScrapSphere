const colors = require('colors');
const figlet = require('figlet');

// وظيفة لطباعة الطلبات بشكل منمق
const loggerMiddleware = (req, res, next) => {
    const { method, url } = req;
    const currentTime = new Date().toISOString();

    // نصوص مُزخرفة
    const requestText = figlet.textSync('Request', { horizontalLayout: 'full' });
    const responseText = figlet.textSync('Response', { horizontalLayout: 'full' });

    // طباعة الطلب الوارد
    console.log(requestText.blue);
    console.log(`Time: ${currentTime}`.green);
    console.log(`Method: ${method}`.yellow);
    console.log(`URL: ${url}`.cyan);
    console.log('---'.magenta);

    // تسجيل الردود
    const originalSend = res.send;
    res.send = function (body) {
        console.log(responseText.red);
        console.log(`Time: ${new Date().toISOString()}`.green);
        console.log(`Status Code: ${res.statusCode}`.yellow);
        console.log(`Response Body: ${body}`.cyan);
        console.log('---'.magenta);

        // استدعاء الدالة الأصلية لإرسال الرد
        originalSend.apply(res, arguments);
    };

    next();
};

module.exports = loggerMiddleware;
