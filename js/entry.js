{

    const uploadBtnEl = document.querySelector('.upload-btn')
    const fileInputEl = document.querySelector('.font-input')
    const fontNameInputEl = document.querySelector('.font-name-input')
    const fontDisplaySelectEl = document.querySelector('.font-display-select')
    const alertEl = document.querySelector('.alert')

    uploadBtnEl.addEventListener('click', () => {
        // clear file input 
        fileInputEl.value = ''
        // open file input
        fileInputEl.click()
    })

    fileInputEl.addEventListener('change', () => {
        toggleUploadBtn(false)
        setAlert('加载中，请稍后...')
        fileReaderHandler(fileInputEl.files[0])
    })

    const fileReaderHandler = (fontFile) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            fontReaderHandler(e.target.result);
        }
        reader.onerror = (e) => {
            toggleUploadBtn(true)
            setAlert('文件加载失败，请重试', 3000)
        }
        reader.readAsArrayBuffer(fontFile)
    }

    const fontReaderHandler = (fontFileData) => {
        fontSlicer(fontFileData)
    }


    const work = require('webworkify');
    const worker = work(require('./worker.js'));

    worker.addEventListener('message', function ({ data }) {
        let { status, ...extraData } = data
        console.log(status, extraData)
        switch (status) {
            case "loaded-success":
                setAlert('请点击下面的按钮选择字体文件')
                toggleUploadBtn(true)
                break;
            case "loaded-error":
                setAlert('加载失败，请重试')
                break;
            case "processing":
                setAlert('字体切片中...')
                toggleUploadBtn(false)
                break;
            case "slice":
                setAlert(`处理第 ${extraData.slice + 1} 个字体切片(共 ${extraData.total+1} 个)...`)
                break;
            case "success":
                const zipUrl = URL.createObjectURL(extraData.zipData);
                // download zipUrl auto
                const a = document.createElement('a');
                a.href = zipUrl;
                a.download = `${extraData.fontName}_${new Date().getTime().toString().slice(1, 9)}.zip`;
                a.click();
                URL.revokeObjectURL(zipUrl);
                setAlert(`字体切片完成，自动下载中...`)
                setTimeout(() => {
                    setAlert(`请点击下面的按钮选择字体文件`)
                    toggleUploadBtn(true)
                }, 3000)
                break;
            case "error":
                setAlert(`字体切片失败`)
                setTimeout(() => {
                    setAlert(`请点击下面的按钮选择字体文件`)
                    toggleUploadBtn(true)
                }, 3000)
                break;

            default:

                break;
        }
    });

    const FONT_DISPLAY_ENUMS = ['auto', 'swap', 'fallback', 'optional']
    const fontSlicer = async (fontBuffer) => {
        setAlert('字体切片中...')
        const fontDisplayType = FONT_DISPLAY_ENUMS[fontDisplaySelectEl.selectedIndex]
        const fontName = fontNameInputEl.value || 'Untitled'
        worker.postMessage({
            fontBuffer,
            fontDisplayType,
            fontName
        })
    }

    const toggleUploadBtn = (state) => {
        if (state) {
            uploadBtnEl.style.display = 'block'
        } else {
            uploadBtnEl.style.display = 'none'
        }
    }

    const setAlert = (msg, delay = 0, cb) => {
        if (delay <= 0) {
            alertEl.innerHTML = msg
        } else {
            alertEl.innerHTML = msg
            setTimeout(() => {
                alertEl.innerHTML = '请点击下面的按钮选择字体文件'
                !cb || cb()
            }, delay)
        }
    }
}