#[derive(Copy, Clone, Debug)]
pub enum Move {
    M,
    Mp,
    Mt,
    U,
    Up,
    Ut,
}

#[derive(Copy, Clone, PartialEq, Eq, Hash)]
pub enum Piece {
    TopBack,
    TopLeft,
    TopFront,
    TopRight,
    BottomBack,
    BottomFront,
}


#[derive(Copy, Clone, PartialEq, Eq, Hash)]
pub struct PieceInfo {
    piece: Piece,
    flipped: bool,
}

impl PieceInfo {
    pub fn create(piece: Piece) -> Self {
        Self {
            piece,
            flipped: false,
        }
    }

    fn is_solved(&self, piece: Piece) -> bool {
        self.piece == piece && !self.flipped
    }

    pub fn flipped(&self) -> Self {
        Self {
            piece: self.piece,
            flipped: !self.flipped,
        }
    }
}


#[derive(Clone, PartialEq, Eq, Hash)]
pub struct State {
    pub top_back: PieceInfo,
    pub top_left: PieceInfo,
    pub top_front: PieceInfo,
    pub top_right: PieceInfo,
    pub bottom_back: PieceInfo,
    pub bottom_front: PieceInfo,
    pub m_parity: i32,
    pub u_parity: i32,
}

impl State {
    pub fn default() -> Self {
        Self {
            top_back: PieceInfo::create(Piece::TopBack),
            top_left: PieceInfo::create(Piece::TopLeft),
            top_front: PieceInfo::create(Piece::TopFront),
            top_right: PieceInfo::create(Piece::TopRight),
            bottom_back: PieceInfo::create(Piece::BottomBack),
            bottom_front: PieceInfo::create(Piece::BottomFront),
            m_parity: 0,
            u_parity: 0,
        }
    }

    pub fn is_solved(&self) -> bool {
        self.top_back.is_solved(Piece::TopBack) &&
        self.top_left.is_solved(Piece::TopLeft) &&
        self.top_front.is_solved(Piece::TopFront) &&
        self.top_right.is_solved(Piece::TopRight) &&
        self.bottom_back.is_solved(Piece::BottomBack) &&
        self.bottom_front.is_solved(Piece::BottomFront) &&
        self.m_parity == 0 &&
        self.u_parity == 0
    }

    pub fn apply(&self, m: Move) -> Self {
        match m {
            Move::M => Self {
                top_back: self.bottom_back.flipped(),
                top_left: self.top_left,
                top_front: self.top_back.flipped(),
                top_right: self.top_right,
                bottom_back: self.bottom_front.flipped(),
                bottom_front: self.top_front.flipped(),
                m_parity: (self.m_parity + 1) % 4,
                u_parity: self.u_parity,
            },
            Move::Mp => Self {
                top_back: self.top_front.flipped(),
                top_left: self.top_left,
                top_front: self.bottom_front.flipped(),
                top_right: self.top_right,
                bottom_back: self.top_back.flipped(),
                bottom_front: self.bottom_back.flipped(),
                m_parity: (self.m_parity + 3) % 4,
                u_parity: self.u_parity,
            },
            Move::Mt => Self {
                top_back: self.bottom_front,
                top_left: self.top_left,
                top_front: self.bottom_back,
                top_right: self.top_right,
                bottom_back: self.top_front,
                bottom_front: self.top_back,
                m_parity: (self.m_parity + 2) % 4,
                u_parity: self.u_parity,
            },
            Move::U => Self {
                top_back: self.top_left,
                top_left: self.top_front,
                top_front: self.top_right,
                top_right: self.top_back,
                bottom_back: self.bottom_back,
                bottom_front: self.bottom_front,
                m_parity: self.m_parity,
                u_parity: (self.u_parity + 1) % 4,
            },
            Move::Up => Self {
                top_back: self.top_right,
                top_left: self.top_back,
                top_front: self.top_left,
                top_right: self.top_front,
                bottom_back: self.bottom_back,
                bottom_front: self.bottom_front,
                m_parity: self.m_parity,
                u_parity: (self.u_parity + 3) % 4,
            },
            Move::Ut => Self {
                top_back: self.top_front,
                top_left: self.top_right,
                top_front: self.top_back,
                top_right: self.top_left,
                bottom_back: self.bottom_back,
                bottom_front: self.bottom_front,
                m_parity: self.m_parity,
                u_parity: (self.u_parity + 2) % 4,
            },
        }
    }

    pub fn apply_all(&self, moves: &Vec<Move>) -> Self {
        let mut result = self.clone();

        for m in moves {
            result = result.apply(*m);
        }
        result
    }
}


pub trait WithPush<T> {
    fn with_push(&self, item: T) -> Self;
}

impl WithPush<Move> for Vec<Move> {
    fn with_push(&self, item: Move) -> Self {
        let mut result = self.clone();
        result.push(item);
        result
    }
}
