class_name ChatMessage

# Set to `null` in case the message has no author.
var player_id: PlayerId
# Set to empty string in case the message has no author.
var player_username: String

var text: String

func _init(player_id: PlayerId, player_username: String, text: String):
    self.player_id = player_id
    self.player_username = player_username
    self.text = text
