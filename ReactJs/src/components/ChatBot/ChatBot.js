import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { postChatbotMessage } from "../../services/userService";
import "./Chatbot.scss";

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          from: "bot",
          text: (
            <FormattedMessage
              id="chatbot.chatbot.welcome"
              defaultMessage="Xin chào 👋, tôi là trợ lý y tế AI. Bạn muốn hỏi gì?"
            />
          ),
        },
      ],
      input: "",
      isOpen: false,
      animate: true,
    };

    this.suggestions = [
      { id: "chatbot.chatbot.suggestion1" },
      { id: "chatbot.chatbot.suggestion2" },
      { id: "chatbot.chatbot.suggestion3" },
      { id: "chatbot.chatbot.suggestion4" },
    ];
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((prev) => ({ animate: !prev.animate }));
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  sendMessage = async (text) => {
    const userMessage = text || this.state.input;
    if (!userMessage.trim()) return;

    const newMessages = [
      ...this.state.messages,
      { from: "user", text: userMessage },
    ];

    this.setState({
      messages: [...newMessages, { from: "bot", typing: true }],
      input: "",
    });

    try {
      const res = await postChatbotMessage(userMessage);
      console.log("Chatbot API response:", res);
      const reply =
        res && res.reply
          ? res.reply.trim()
          : this.props.intl.formatMessage({
            id: "chatbot.chatbot.noAnswer",
            defaultMessage: "Xin lỗi, tôi chưa có câu trả lời phù hợp.",
          });

      this.setState((prev) => ({
        messages: [
          ...prev.messages.filter((m) => !m.typing),
          { from: "bot", text: reply },
        ],
      }));
    } catch (err) {
      console.error("Chatbot API error:", err);
      this.setState({
        messages: [
          ...newMessages,
          {
            from: "bot",
            text: this.props.intl.formatMessage({
              id: "chatbot.chatbot.error",
              defaultMessage: "Có lỗi khi gọi API backend.",
            }),
          },
        ],
      });
    }
  };

  render() {
    const { messages, input, isOpen, animate } = this.state;

    return (
      <div>
        <div
          className={`chatbot-avatar ${animate ? "animate" : ""}`}
          onClick={() => this.setState({ isOpen: !isOpen })}
        >
          <img
            src="/images/pngtree-smart-chatbot-cartoon-clipart-png-image_9015126.png"
            alt="Chatbot"
          />
          <div className="content-chatbot"><FormattedMessage id="chatbot.AI" /></div>
        </div>

        {isOpen && (
          <div className="chatbot-container">
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chatbot-message ${msg.from} ${msg.typing ? "typing" : ""
                    }`}
                >
                  {msg.typing ? (
                    <div className="typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <span>
                      {typeof msg.text === "string" ? msg.text : msg.text}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="chatbot-suggestions">
              <div className="title">
                <FormattedMessage
                  id="chatbot.chatbot.suggestions"
                  defaultMessage="Gợi ý câu hỏi:"
                />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {this.suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      this.sendMessage(
                        this.props.intl.formatMessage({ id: s.id })
                      )
                    }
                  >
                    <FormattedMessage id={s.id} />
                  </button>
                ))}
              </div>
            </div>

            <div className="chatbot-input">
              <input
                value={input}
                onChange={(e) => this.setState({ input: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && this.sendMessage()}
                placeholder={this.props.intl.formatMessage({
                  id: "chatbot.chatbot.placeholder",
                  defaultMessage: "Nhập tin nhắn...",
                })}
              />
              <button onClick={() => this.sendMessage()}>
                <FormattedMessage
                  id="chatbot.chatbot.send"
                  defaultMessage="Gửi"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(injectIntl(Chatbot));
