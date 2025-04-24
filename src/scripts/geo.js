jQuery(document).ready(function ($) {

    function setCookie(cname, cvalue, hours) {
        var d = new Date();
        d.setTime(d.getTime() + hours * 43200000);
        var expires = (hours)?"expires=" + d.toUTCString():"";
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }

    $('.confirm-city').on('click', function(){
        var city = $('.select-city-item.active-city').attr('href');
        localStorage.setItem('city', city);

        if (city !== '/') {
            window.location.href = city;
        }
        setCookie('geolocation', 'OK', 360);



    });

    //get current position
    if ($(".locations-address li:nth-child(1)").length && $('body').hasClass('home')) {

        if (navigator.geolocation && !getCookie('geolocation')) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    let geocoder = new google.maps.Geocoder();
                    let latlng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    geocoder.geocode({ location: latlng }, function (results, status) {
                        if (status == "OK") {
                            let checkCity = "locality";
                            for (let i = 0; i < results.length; i++) {
                                for (let j = 0; j < results[i].address_components.length; j++) {
                                    let searchType = results[i].address_components[j].types[0];
                                    //check city
                                    if (searchType == checkCity) {
                                        let setNameCity =
                                            results[i].address_components[j].short_name;
                                        $("#set-city").html(setNameCity);
                                        console.log(setNameCity);
                                        // setCookie('geolocation', 'OK', 360);
                                        // window.location.href = "";


                                        if (setNameCity == 'Львів'){
                                            $('.select-city-id-17').addClass('active-city');
                                            $('.confirm-city').trigger('click');

                                        } else if (city == 'Івано-Франківськ') {
                                            $('.select-city-id-6').addClass('active-city');
                                            $('.confirm-city').trigger('click');
                                        } else if (city == 'Коломия') {
                                            $('.select-city-id-8').addClass('active-city');
                                            $('.confirm-city').trigger('click');
                                        } else if (city == 'Чернівці') {
                                            $('.select-city-id-10').addClass('active-city');
                                            $('.confirm-city').trigger('click');
                                        } else if (city == 'Хмельницький') {
                                            $('.select-city-id-11').addClass('active-city');
                                            $('.confirm-city').trigger('click');
                                        } else if (city == 'Ужгород') {
                                            $('.select-city-id-12').addClass('active-city');
                                            $('.confirm-city').trigger('click');
                                        } else if (city == 'Київ') {
                                            $('.select-city-id-14').addClass('active-city');
                                            $('.confirm-city').trigger('click');
                                        } else if (city == 'Тернопіль') {
                                            $('.select-city-id-15').addClass('active-city');
                                            $('.confirm-city').trigger('click');
                                        } else if (city == 'Луцьк') {
                                            $('.select-city-id-16').addClass('active-city');
                                            $('.confirm-city').trigger('click');
                                        } else if (city == 'Кам\'янець-Подільський') {
                                            $('.select-city-id-20').addClass('active-city');
                                            $('.confirm-city').trigger('click');
                                        } else if (city == 'Вінниця') {
                                            $('.select-city-id-21').addClass('active-city');
                                            $('.confirm-city').trigger('click');
                                        } else {
                                            // if (!localStorage.getItem('city')){
                                            _functions.openPopup('.popup-content[data-rel="select-city"]');
                                            // }
                                        }

                                    }
                                }
                            }
                        } else {
                            console.log("open popup, example: see next line1");
                            _functions.openPopup('.popup-content[data-rel="select-city"]');
                        }
                    });
                },
                function (position) {
                    console.log("open popup, example: see next line2");
                    _functions.openPopup('.popup-content[data-rel="select-city"]');
                }
            );
        } else {
            setCookie('geolocation', 'OK', 360);
            console.log("open popup, example: see next line3");
            // _functions.openPopup('.popup-content[data-rel="select-city"]');
        }
    }
});
