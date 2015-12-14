###
# Welcome to the new js2coffee 2.0, now
# rewritten to use the esprima parser.
# try it out!
###

class GraphicsController
  constructor: ->
    that = this
    @currentData = {}

    this.poll()

    setInterval (->
      that.poll()
      ), 1000

    setInterval (->
      $(window).trigger('tick')
      ), 500

  poll: =>
    pollUrl = 'http://localhost:27015/data.json'

    $.ajax pollUrl,
    timeout: 15000
    success: (data) =>
      if !data
        console.log("No data received")
        return

      @currentData = data
      clock.update(@currentData.clock)
      lowerThird.update(@currentData.lowerThird)

      return
    return

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