// Register AR component
AFRAME.registerComponent('ar-camera', {
    schema: { elid: { type: 'string' }, cameraid: { type: 'string' } },
    init: function () {
        window.ARcamera = {};

        if (this.data.cameraid != '') {
            window.ARcamera.camera = document.getElementById(this.data.cameraid);
        } else {
            window.ARcamera.camera = document.querySelector('a-camera');
        }

        window.ARcamera.video_component = this.el;
        window.ARcamera.canvas = document.createElement('canvas');

        window.ARcamera.el_obj = document.getElementById(this.data.elid);

        window.ARcamera.detector = new AR.Detector();

        window.ARcamera.size_real = 95;

        window.ARcamera.timeDelta = 0;
    },
    update: function (oldData) {
        if (oldData.elid !== this.data.elid) {
            window.ARcamera.el_obj = document.getElementById(this.data.elid);
        }
        if (oldData.cameraid !== this.data.cameraid) {
            if (this.data.cameraid != '') {
                window.ARcamera.camera = document.getElementById(this.data.cameraid);
            } else {
                window.ARcamera.camera = document.querySelector('a-camera');
            }
        }
    },
    tick: function (time, timeDelta) {
        window.ARcamera.timeDelta += timeDelta;
        if (window.ARcamera.timeDelta < 60) {
            return;
        }
        window.ARcamera.timeDelta = 0;
        if (typeof window.ARcamera.video == 'undefined') {
            if (window.ARcamera.video_component.getAttribute('src') != null) {
                //TODO: can i detect the video id generated by a-video-billboard ?? I can generalize the component here
                window.ARcamera.video = document.getElementById(window.ARcamera.video_component.getAttribute('src').substr(1));
                window.ARcamera.canvas.width = window.ARcamera.video.videoWidth;
                window.ARcamera.canvas.height = window.ARcamera.video.videoHeight;
                window.ARcamera.context = window.ARcamera.canvas.getContext('2d');

                window.ARcamera.view_width = window.ARcamera.video_component.getAttribute('width'),
                    window.ARcamera.view_heigth = window.ARcamera.video_component.getAttribute('height');
                window.ARcamera.view_depth = window.ARcamera.video_component.getAttribute('frustum-lock').depth;
            }
        } else {
            window.ARcamera.context.drawImage(window.ARcamera.video, 0, 0, window.ARcamera.video.videoWidth, window.ARcamera.video.videoHeight);
            var imageData = window.ARcamera.context.getImageData(0, 0, window.ARcamera.canvas.width, window.ARcamera.canvas.height);

            var markers = window.ARcamera.detector.detect(imageData);

            if (markers.length > 0) {
                var points = markers[0].corners;

                var position = calcIntersection(generateLine(points[0], points[2]), generateLine(points[1], points[3]));

                // Marker "only" x rotated
                if (Math.abs(calcAngle(points[0], points[1])) < Math.PI / 8 && Math.abs(calcAngle(points[2], points[3])) < Math.PI / 8) {
                    line_near = calcMax(generateLine(points[0], points[1]), generateLine(points[2], points[3]));
                    line_far = calcMin(generateLine(points[0], points[1]), generateLine(points[2], points[3]));
                    line_side1 = generateLine(points[1], points[2]);
                    line_side2 = generateLine(points[3], points[0]);
                    // Marker "only" x rotated
                } else if (Math.abs(calcAngle(points[1], points[2])) < Math.PI / 8 && Math.abs(calcAngle(points[3], points[0])) < Math.PI / 8) {
                    line_near = calcMax(generateLine(points[1], points[2]), generateLine(points[3], points[0]));
                    line_far = calcMin(generateLine(points[1], points[2]), generateLine(points[3], points[0]));
                    line_side1 = generateLine(points[0], points[1]);
                    line_side2 = generateLine(points[2], points[3]);
                } else { // TODO: other cases. e: 
                    line_near = generateLine(points[1], points[2]);
                    line_far = generateLine(points[3], points[0]);
                    line_side1 = generateLine(points[0], points[1]);
                    line_side2 = generateLine(points[2], points[3]);
                }
                line_final = line_near;// TODO: parallel line_near in point position insersect with line_side1,line_side2

                line_far_size = calcSize(line_far);
                line_near_size = calcSize(line_near);
                line_final_size = calcSize(line_final);
                x_final = (position.x * window.ARcamera.view_width / window.ARcamera.canvas.width) - window.ARcamera.view_width * .5;
                y_final = (position.y * window.ARcamera.view_heigth / window.ARcamera.canvas.height) - window.ARcamera.view_heigth * .5;
                z_final = window.ARcamera.size_real / line_final_size;

                // Distance correction
                ly_final = Math.atan(y_final / window.ARcamera.view_depth);
                y_final = z_final * Math.tan(ly_final);

                lx_final = Math.atan(x_final / window.ARcamera.view_depth);
                x_final = z_final * Math.tan(lx_final);


                /*
                lx_rota_size = calcDistance(getPoints(line_near)[0],getPoints(line_far)[0]);
                lx_rotb_size = (line_near_size-line_far_size)/2;
                lx_rot = Math.asin(lx_rotb_size/lx_rota_size);
                x_rot = 20*180*lx_rot/Math.PI;
                */
                /*
                x_rota_size = (window.ARcamera.size_real/line_far_size) - (window.ARcamera.size_real/line_near_size);
                x_rotb_size = 0.04;
                lx_rot = Math.acos(x_rota_size/x_rotb_size);
                x_rot = 180*lx_rot/Math.PI;
                */
                z_rot = 180 * calcAngle(getPoints(line_final)[0], getPoints(line_final)[1]) / Math.PI;


                var pos_cam = window.ARcamera.camera.getAttribute('position');
                var rot_cam = window.ARcamera.camera.getAttribute('rotation');

                // Set position and rotation values
                var pos = window.ARcamera.el_obj.getAttribute('position');
                var rot = window.ARcamera.el_obj.getAttribute('rotation');
                pos.x = pos_cam.x - x_final;
                pos.y = pos_cam.y - y_final;
                pos.z = pos_cam.z - z_final;

                //rot.x = -x_rot;
                //rot.y = -y_rot;
                rot.z = z_rot;


                window.ARcamera.el_obj.setAttribute('position', pos);
                window.ARcamera.el_obj.setAttribute('rotation', rot);
            }
        }
    }
});