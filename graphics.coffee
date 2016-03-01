socket = io('http://localhost:27015')

convertHex = (hex, opacity) ->
  hex = hex.replace('#', '')
  r = parseInt(hex.substring(0, 2), 16)
  g = parseInt(hex.substring(2, 4), 16)
  b = parseInt(hex.substring(4, 6), 16)
  result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')'
  result

class GraphicsController
  constructor: ->
    @currentData = {}

    setInterval (->
      $(window).trigger('tick')
      ), 500

    socket.on 'newData', (data) =>
      @update(data)

  update: (data) =>
    @currentData = data
    clock.update(@currentData.clock)
    lowerThird.update(@currentData.lowerThird)
    $('.widget').css('background', convertHex(@currentData.styling.Color1, 50))
    $('#lowerThird').css('border-bottom-color', convertHex(@currentData.styling.Color2, 100))

class Clock
  constructor: ->
    @properties = { Visible: true, Offset: 0 }
    $(window).bind('tick', @tick)

  tick: =>
    d = new Date()
    currentMinutes = d.getMinutes()
    currentSeconds = d.getSeconds()
    currentHours = Number(d.getHours()) + Number(@properties.Offset)
    if currentMinutes.toString().length == 1
      currentMinutes = "0" + currentMinutes
    if currentSeconds.toString().length == 1
      currentSeconds = "0" + currentSeconds

    $('#clock').html(currentHours + ':' + currentMinutes + ':' + currentSeconds)

  update: (widget) =>
    @properties = widget
    @properties.Visible = if widget.Visible == 'true' then true else false

    $('#clock').toggleClass('hide', !@properties.Visible);

class LowerThird
  constructor: ->
    @properties = { Visible: true, Name: "Name goes here", Title: "CEO", Company: "Stream My Event" }

  update: (widget) =>
    @properties = widget
    @properties.Visible = if widget.Visible == 'true' then true else false
    $('#lowerThird').toggleClass('hide', !@properties.Visible)
    $('#lowerThird #name').text(@properties.Name)
    $('#lowerThird #function').text(@properties.Title)
    $('#lowerThird #company').text(@properties.Company)

window.controller = new GraphicsController();
window.clock = new Clock();
window.lowerThird = new LowerThird();